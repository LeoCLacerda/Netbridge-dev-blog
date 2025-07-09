using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System.Text.Json;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Webp;

namespace NetBridgeDev.Api
{
    public static class UploadImageFunction
    {
        [FunctionName("UploadImageFunction")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("UploadImageFunction processando requisição de upload de imagem.");

            try
            {
                // Verificar se há arquivos na requisição
                if (!req.HasFormContentType || req.Form.Files.Count == 0)
                {
                    return new BadRequestObjectResult(new { error = "Nenhuma imagem foi enviada." });
                }

                var imageFile = req.Form.Files["image"];
                var imageId = req.Form["imageId"].ToString();
                var originalName = req.Form["originalName"].ToString();

                if (imageFile == null || imageFile.Length == 0)
                {
                    return new BadRequestObjectResult(new { error = "Arquivo de imagem inválido." });
                }

                // Validar tipo de arquivo
                var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };
                if (!Array.Exists(allowedTypes, type => type == imageFile.ContentType))
                {
                    return new BadRequestObjectResult(new { error = "Tipo de arquivo não suportado. Use JPEG, PNG, GIF ou WebP." });
                }

                // Validar tamanho (5MB máximo)
                const long maxSizeBytes = 5 * 1024 * 1024; // 5MB
                if (imageFile.Length > maxSizeBytes)
                {
                    return new BadRequestObjectResult(new { error = "Imagem deve ter no máximo 5MB." });
                }

                // Configurar Azure Blob Storage
                var connectionString = Environment.GetEnvironmentVariable("AzureWebJobsStorage");
                var containerName = "blog-images";
                
                var blobServiceClient = new BlobServiceClient(connectionString);
                var containerClient = blobServiceClient.GetBlobContainerClient(containerName);
                
                // Criar container se não existir
                await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

                // Processar e otimizar imagem
                var processedImageData = await ProcessImage(imageFile);
                
                // Gerar nome único para o blob
                var fileExtension = Path.GetExtension(originalName).ToLowerInvariant();
                if (string.IsNullOrEmpty(fileExtension))
                {
                    fileExtension = GetExtensionFromContentType(imageFile.ContentType);
                }
                
                var blobName = $"{DateTime.UtcNow:yyyy/MM/dd}/{imageId}{fileExtension}";
                var blobClient = containerClient.GetBlobClient(blobName);

                // Upload da imagem processada
                using (var stream = new MemoryStream(processedImageData.ImageBytes))
                {
                    var blobHttpHeaders = new BlobHttpHeaders
                    {
                        ContentType = processedImageData.ContentType,
                        CacheControl = "public, max-age=31536000" // Cache por 1 ano
                    };

                    await blobClient.UploadAsync(stream, new BlobUploadOptions
                    {
                        HttpHeaders = blobHttpHeaders,
                        Metadata = new Dictionary<string, string>
                        {
                            { "originalName", originalName },
                            { "imageId", imageId },
                            { "uploadDate", DateTime.UtcNow.ToString("O") },
                            { "originalSize", imageFile.Length.ToString() },
                            { "processedSize", processedImageData.ImageBytes.Length.ToString() }
                        }
                    });
                }

                // Retornar URL da imagem
                var imageUrl = blobClient.Uri.ToString();
                
                log.LogInformation($"Imagem {imageId} enviada com sucesso: {imageUrl}");

                return new OkObjectResult(new
                {
                    success = true,
                    url = imageUrl,
                    imageId = imageId,
                    originalSize = imageFile.Length,
                    processedSize = processedImageData.ImageBytes.Length,
                    compressionRatio = Math.Round((1.0 - (double)processedImageData.ImageBytes.Length / imageFile.Length) * 100, 2),
                    blobName = blobName
                });
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Erro ao processar upload de imagem");
                return new StatusCodeResult(500);
            }
        }

        private static async Task<(byte[] ImageBytes, string ContentType)> ProcessImage(IFormFile imageFile)
        {
            using var inputStream = imageFile.OpenReadStream();
            using var image = await Image.LoadAsync(inputStream);

            // Redimensionar se necessário (máximo 1920x1080)
            const int maxWidth = 1920;
            const int maxHeight = 1080;

            if (image.Width > maxWidth || image.Height > maxHeight)
            {
                var ratioX = (double)maxWidth / image.Width;
                var ratioY = (double)maxHeight / image.Height;
                var ratio = Math.Min(ratioX, ratioY);

                var newWidth = (int)(image.Width * ratio);
                var newHeight = (int)(image.Height * ratio);

                image.Mutate(x => x.Resize(newWidth, newHeight));
            }

            // Determinar formato de saída e qualidade
            var outputStream = new MemoryStream();
            string contentType;

            // Converter para WebP se possível (melhor compressão)
            if (imageFile.ContentType == "image/png" && image.Width * image.Height > 500000) // Imagens grandes
            {
                await image.SaveAsWebpAsync(outputStream, new WebpEncoder { Quality = 85 });
                contentType = "image/webp";
            }
            else if (imageFile.ContentType.Contains("jpeg") || imageFile.ContentType.Contains("jpg"))
            {
                await image.SaveAsJpegAsync(outputStream, new JpegEncoder { Quality = 85 });
                contentType = "image/jpeg";
            }
            else if (imageFile.ContentType == "image/png")
            {
                await image.SaveAsPngAsync(outputStream, new PngEncoder { CompressionLevel = PngCompressionLevel.BestCompression });
                contentType = "image/png";
            }
            else
            {
                // Fallback para JPEG
                await image.SaveAsJpegAsync(outputStream, new JpegEncoder { Quality = 85 });
                contentType = "image/jpeg";
            }

            return (outputStream.ToArray(), contentType);
        }

        private static string GetExtensionFromContentType(string contentType)
        {
            return contentType switch
            {
                "image/jpeg" => ".jpg",
                "image/jpg" => ".jpg",
                "image/png" => ".png",
                "image/gif" => ".gif",
                "image/webp" => ".webp",
                _ => ".jpg"
            };
        }
    }
}

