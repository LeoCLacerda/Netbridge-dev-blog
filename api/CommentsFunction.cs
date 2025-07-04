using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.IO;

namespace api;

public class CommentsFunction
{
    private readonly ILogger<CommentsFunction> _logger;

    public CommentsFunction(ILogger<CommentsFunction> logger)
    {
        _logger = logger;
    }

    [Function("CommentsFunction")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");

        string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        // Aqui você faria o parse do JSON e salvaria o comentário em um banco de dados
        _logger.LogInformation($"Received comment: {requestBody}");

        return new OkObjectResult("Comment received successfully!");
    }
}


