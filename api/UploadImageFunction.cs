using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
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
    public class UploadImageFunction
    {
        private readonly ILogger<UploadImageFunction> _logger;

        public UploadImageFunction(ILogger<UploadImageFunction> logger)
        {
            _logger = logger;
        }

        [Function("UploadImageFunction")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req)
        {
            _logger.LogInformation("UploadImageFunction processando requisição de upload de imagem.");

            try
            {
                // Verificar se há arquivos na requisição
                var formData = await req.ReadFormAsync();
                
                if (formData.Files.Count == 0)
                {
                    var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badResponse.WriteAsJsonAsync(new { error = "Nenhuma imagem foi enviada." });
                    return badResponse;
                }

                var imageFile = formData.Files["image"];
                var imageId = formData["imageId"].ToString();
                var originalName = formData["originalName"].ToString();

                if (imageFile == null || imageFile.Length == 0)
                {
                    var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badResponse.WriteAsJsonAsync(new { error = "Arquivo de imagem inválido." });
                    return badResponse;
                }

                // Validar tipo de arquivo
                var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };
                if (!Array.Exists(allowedTypes, type => type == imageFile.ContentType))
                {
                    var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badResponse.WriteAsJsonAsync(new { error = "Tipo de arquivo não suportado. Use JPEG, PNG, GIF ou WebP." });
                    return badResponse;
                }

                // Validar tamanho (5MB máximo)
                const long maxSizeBytes = 5 * 1024 * 1024; // 5MB
                if (imageFile.Length > maxSizeBytes)
                {
                    var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badResponse.WriteAsJsonAsync(new { error = "Imagem deve ter no máximo 5MB." });
                    return badResponse;
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
                
                _logger.LogInformation($"Imagem {imageId} enviada com sucesso: {imageUrl}");

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(new
                {
                    success = true,
                    url = imageUrl,
                    imageId = imageId,
                    originalSize = imageFile.Length,
                    processedSize = processedImageData.ImageBytes.Length,
                    compressionRatio = Math.Round((1.0 - (double)processedImageData.ImageBytes.Length / imageFile.Length) * 100, 2),
                    blobName = blobName
                });

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar upload de imagem");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteAsJsonAsync(new { error = "Erro interno do servidor" });
                return errorResponse;
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

    // Interface para compatibilidade com IFormFile
    public interface IFormFile
    {
        string ContentType { get; }
        long Length { get; }
        string Name { get; }
        Stream OpenReadStream();
    }

    // Implementação simples para compatibilidade
    public class FormFileWrapper : IFormFile
    {
        private readonly Stream _stream;
        
        public FormFileWrapper(Stream stream, string contentType, long length, string name)
        {
            _stream = stream;
            ContentType = contentType;
            Length = length;
            Name = name;
        }

        public string ContentType { get; }
        public long Length { get; }
        public string Name { get; }
        
        public Stream OpenReadStream() => _stream;
    }
}

