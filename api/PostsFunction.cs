using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace NetBridgeDev.Api
{
    public static class PostsFunction
    {
        [FunctionName("PostsFunction")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("PostsFunction processando requisição.");

            try
            {
                if (req.Method == "GET")
                {
                    return await HandleGetPosts(req, log);
                }
                else if (req.Method == "POST")
                {
                    return await HandleCreatePost(req, log);
                }
                else
                {
                    return new BadRequestObjectResult(new { error = "Método não suportado." });
                }
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Erro ao processar requisição de posts");
                return new StatusCodeResult(500);
            }
        }

        private static async Task<IActionResult> HandleGetPosts(HttpRequest req, ILogger log)
        {
            // Simular dados de posts para desenvolvimento
            var posts = new[]
            {
                new
                {
                    id = 1,
                    title = "Introdução ao .NET 8",
                    description = "Descubra as novidades e melhorias do .NET 8, incluindo performance, novas APIs e recursos de desenvolvimento.",
                    content = "<p>O .NET 8 trouxe muitas melhorias significativas...</p>",
                    createdAt = "2024-01-15T10:00:00Z",
                    author = "NetBridge.Dev",
                    tags = new[] { ".NET", "C#", "Development" },
                    imageUrl = "https://via.placeholder.com/800x400/4facfe/ffffff?text=.NET+8"
                },
                new
                {
                    id = 2,
                    title = "Azure Functions com C#",
                    description = "Aprenda a criar e deployar Azure Functions usando C# para construir aplicações serverless escaláveis.",
                    content = "<p>Azure Functions é uma solução serverless...</p>",
                    createdAt = "2024-01-10T14:30:00Z",
                    author = "NetBridge.Dev",
                    tags = new[] { "Azure", "Serverless", "C#" },
                    imageUrl = "https://via.placeholder.com/800x400/00f2fe/ffffff?text=Azure+Functions"
                },
                new
                {
                    id = 3,
                    title = "Blazor WebAssembly Performance",
                    description = "Técnicas avançadas para otimizar a performance de aplicações Blazor WebAssembly em produção.",
                    content = "<p>Blazor WebAssembly oferece uma experiência rica...</p>",
                    createdAt = "2024-01-05T09:15:00Z",
                    author = "NetBridge.Dev",
                    tags = new[] { "Blazor", "WebAssembly", "Performance" },
                    imageUrl = "https://via.placeholder.com/800x400/4facfe/ffffff?text=Blazor+WASM"
                }
            };

            var lastPosts = posts.Take(10).Select(p => new
            {
                id = p.id,
                title = p.title,
                createdAt = p.createdAt
            }).ToArray();

            return new OkObjectResult(new
            {
                posts = posts,
                lastPosts = lastPosts,
                total = posts.Length
            });
        }

        private static async Task<IActionResult> HandleCreatePost(HttpRequest req, ILogger log)
        {
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            
            if (string.IsNullOrEmpty(requestBody))
            {
                return new BadRequestObjectResult(new { error = "Corpo da requisição vazio." });
            }

            try
            {
                var postData = JsonSerializer.Deserialize<PostCreateRequest>(requestBody, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                // Validar dados obrigatórios
                if (string.IsNullOrWhiteSpace(postData.Title))
                {
                    return new BadRequestObjectResult(new { error = "Título é obrigatório." });
                }

                if (string.IsNullOrWhiteSpace(postData.Description))
                {
                    return new BadRequestObjectResult(new { error = "Descrição é obrigatória." });
                }

                if (string.IsNullOrWhiteSpace(postData.Content))
                {
                    return new BadRequestObjectResult(new { error = "Conteúdo é obrigatório." });
                }

                // Processar conteúdo HTML
                var processedContent = ProcessHtmlContent(postData.Content, postData.Images, log);

                // Criar objeto do post
                var newPost = new
                {
                    id = postData.Id ?? DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                    title = postData.Title.Trim(),
                    description = postData.Description.Trim(),
                    content = processedContent,
                    createdAt = postData.CreatedAt ?? DateTime.UtcNow.ToString("O"),
                    author = "NetBridge.Dev",
                    tags = ExtractTagsFromContent(processedContent),
                    images = postData.Images?.Where(img => img.Success).Select(img => new
                    {
                        imageId = img.ImageId,
                        url = img.FinalUrl,
                        tempUrl = img.TempUrl
                    }).ToArray() ?? new object[0],
                    status = "published",
                    slug = GenerateSlug(postData.Title)
                };

                // Aqui você salvaria no banco de dados
                // Por enquanto, apenas log
                log.LogInformation($"Post criado com sucesso: {newPost.title}");
                log.LogInformation($"Conteúdo processado com {postData.Images?.Length ?? 0} imagens");

                // Simular salvamento no banco de dados
                await Task.Delay(100); // Simular operação assíncrona

                return new OkObjectResult(new
                {
                    success = true,
                    message = "Post criado com sucesso!",
                    post = newPost,
                    processedImages = postData.Images?.Length ?? 0
                });
            }
            catch (JsonException ex)
            {
                log.LogError(ex, "Erro ao deserializar dados do post");
                return new BadRequestObjectResult(new { error = "Dados do post inválidos." });
            }
        }

        private static string ProcessHtmlContent(string content, ImageUploadResult[] images, ILogger log)
        {
            if (images == null || images.Length == 0)
            {
                return content;
            }

            var processedContent = content;

            // Substituir URLs temporárias pelas URLs finais do blob storage
            foreach (var image in images.Where(img => img.Success))
            {
                try
                {
                    // Escapar caracteres especiais na URL temporária para regex
                    var escapedTempUrl = Regex.Escape(image.TempUrl);
                    var regex = new Regex(escapedTempUrl, RegexOptions.IgnoreCase);
                    
                    processedContent = regex.Replace(processedContent, image.FinalUrl);
                    
                    log.LogInformation($"URL substituída: {image.TempUrl} -> {image.FinalUrl}");
                }
                catch (Exception ex)
                {
                    log.LogWarning(ex, $"Erro ao substituir URL da imagem {image.ImageId}");
                }
            }

            // Adicionar classes CSS para imagens
            processedContent = Regex.Replace(
                processedContent,
                @"<img([^>]*?)>",
                @"<img$1 class=""blog-image"" loading=""lazy"">",
                RegexOptions.IgnoreCase
            );

            return processedContent;
        }

        private static string[] ExtractTagsFromContent(string content)
        {
            var tags = new List<string>();

            // Extrair tags baseadas em palavras-chave comuns
            var keywords = new Dictionary<string, string[]>
            {
                { ".NET", new[] { ".net", "dotnet", "csharp", "c#" } },
                { "Azure", new[] { "azure", "cloud", "microsoft" } },
                { "Blazor", new[] { "blazor", "webassembly", "wasm" } },
                { "Development", new[] { "development", "programming", "coding" } },
                { "Performance", new[] { "performance", "optimization", "speed" } },
                { "Tutorial", new[] { "tutorial", "guide", "how-to" } }
            };

            var lowerContent = content.ToLowerInvariant();

            foreach (var keyword in keywords)
            {
                if (keyword.Value.Any(k => lowerContent.Contains(k)))
                {
                    tags.Add(keyword.Key);
                }
            }

            return tags.Distinct().ToArray();
        }

        private static string GenerateSlug(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return "post";

            // Converter para lowercase e remover acentos
            var slug = title.ToLowerInvariant();
            
            // Remover caracteres especiais e substituir espaços por hífens
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
            slug = Regex.Replace(slug, @"\s+", "-");
            slug = Regex.Replace(slug, @"-+", "-");
            slug = slug.Trim('-');

            return string.IsNullOrEmpty(slug) ? "post" : slug;
        }
    }

    public class PostCreateRequest
    {
        public long? Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Content { get; set; }
        public string CreatedAt { get; set; }
        public ImageUploadResult[] Images { get; set; }
    }

    public class ImageUploadResult
    {
        public string ImageId { get; set; }
        public string TempUrl { get; set; }
        public string FinalUrl { get; set; }
        public bool Success { get; set; }
        public string Error { get; set; }
    }
}

