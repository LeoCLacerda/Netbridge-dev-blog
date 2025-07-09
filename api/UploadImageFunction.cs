using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Text.Json;

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
                // Por enquanto, retornar uma resposta simulada para que o build funcione
                // TODO: Implementar processamento real de imagens após resolver dependências
                
                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(new
                {
                    success = true,
                    url = "https://via.placeholder.com/800x400/4facfe/ffffff?text=Uploaded+Image",
                    imageId = Guid.NewGuid().ToString(),
                    originalSize = 1024000,
                    processedSize = 512000,
                    compressionRatio = 50.0,
                    blobName = "temp/uploaded-image.jpg",
                    message = "Upload simulado - implementação completa em desenvolvimento"
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
    }
}

