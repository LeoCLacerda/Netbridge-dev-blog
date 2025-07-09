using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace NetBridgeDev.Api
{
    public class CommentsFunction
    {
        private readonly ILogger<CommentsFunction> _logger;

        public CommentsFunction(ILogger<CommentsFunction> logger)
        {
            _logger = logger;
        }

        [Function("CommentsFunction")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
        {
            _logger.LogInformation("CommentsFunction processando requisição.");

            try
            {
                if (req.Method == "GET")
                {
                    return await HandleGetComments(req);
                }
                else if (req.Method == "POST")
                {
                    return await HandleCreateComment(req);
                }
                else
                {
                    var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badResponse.WriteAsJsonAsync(new { error = "Método não suportado." });
                    return badResponse;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar requisição de comentários");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteAsJsonAsync(new { error = "Erro interno do servidor" });
                return errorResponse;
            }
        }

        private async Task<HttpResponseData> HandleGetComments(HttpRequestData req)
        {
            // Simular comentários para desenvolvimento
            var comments = new[]
            {
                new
                {
                    id = 1,
                    postId = 1,
                    author = "João Silva",
                    email = "joao@example.com",
                    content = "Excelente artigo sobre .NET 8! Muito esclarecedor.",
                    createdAt = "2024-01-16T10:30:00Z",
                    avatar = "https://via.placeholder.com/40/4facfe/ffffff?text=JS"
                },
                new
                {
                    id = 2,
                    postId = 1,
                    author = "Maria Santos",
                    email = "maria@example.com",
                    content = "Obrigada por compartilhar essas informações. Ajudou muito no meu projeto!",
                    createdAt = "2024-01-16T14:15:00Z",
                    avatar = "https://via.placeholder.com/40/00f2fe/ffffff?text=MS"
                }
            };

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(new
            {
                comments = comments,
                total = comments.Length
            });

            return response;
        }

        private async Task<HttpResponseData> HandleCreateComment(HttpRequestData req)
        {
            string requestBody = await req.ReadAsStringAsync() ?? "";
            
            if (string.IsNullOrEmpty(requestBody))
            {
                var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                await badResponse.WriteAsJsonAsync(new { error = "Corpo da requisição vazio." });
                return badResponse;
            }

            try
            {
                var commentData = JsonSerializer.Deserialize<CommentCreateRequest>(requestBody, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                // Validar dados obrigatórios
                if (string.IsNullOrWhiteSpace(commentData?.Author))
                {
                    var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badResponse.WriteAsJsonAsync(new { error = "Nome do autor é obrigatório." });
                    return badResponse;
                }

                if (string.IsNullOrWhiteSpace(commentData.Content))
                {
                    var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badResponse.WriteAsJsonAsync(new { error = "Conteúdo do comentário é obrigatório." });
                    return badResponse;
                }

                // Criar objeto do comentário
                var newComment = new
                {
                    id = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                    postId = commentData.PostId,
                    author = commentData.Author.Trim(),
                    email = commentData.Email?.Trim() ?? "",
                    content = commentData.Content.Trim(),
                    createdAt = DateTime.UtcNow.ToString("O"),
                    avatar = GenerateAvatar(commentData.Author),
                    status = "approved"
                };

                // Aqui você salvaria no banco de dados
                _logger.LogInformation($"Comentário criado com sucesso para o post {commentData.PostId}");

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(new
                {
                    success = true,
                    message = "Comentário criado com sucesso!",
                    comment = newComment
                });

                return response;
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Erro ao deserializar dados do comentário");
                var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                await badResponse.WriteAsJsonAsync(new { error = "Dados do comentário inválidos." });
                return badResponse;
            }
        }

        private static string GenerateAvatar(string name)
        {
            var initials = string.Join("", name.Split(' ').Take(2).Select(n => n.FirstOrDefault())).ToUpperInvariant();
            var colors = new[] { "4facfe", "00f2fe", "6c5ce7", "a29bfe", "fd79a8", "fdcb6e" };
            var colorIndex = Math.Abs(name.GetHashCode()) % colors.Length;
            return $"https://via.placeholder.com/40/{colors[colorIndex]}/ffffff?text={initials}";
        }
    }

    public class CommentCreateRequest
    {
        public int PostId { get; set; }
        public string Author { get; set; } = "";
        public string? Email { get; set; }
        public string Content { get; set; } = "";
    }
}

