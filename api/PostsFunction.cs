using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace api;

public class PostsFunction
{
    private readonly ILogger<PostsFunction> _logger;

    public PostsFunction(ILogger<PostsFunction> logger)
    {
        _logger = logger;
    }

    [Function("PostsFunction")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");

        var posts = new List<dynamic>
        {
            new {
                id = 1,
                title = "Introdução ao .NET 8",
                description = "Descubra as novidades e melhorias do .NET 8 para desenvolvimento moderno.",
                content = "O .NET 8 representa um marco significativo no desenvolvimento de aplicações modernas...",
                date = "2024-01-15",
                author = "NetBridge Team"
            },
            new {
                id = 2,
                title = "Azure Functions: Serverless Computing",
                description = "Como implementar soluções serverless eficientes com Azure Functions.",
                content = "Azure Functions oferece uma plataforma serverless robusta para desenvolvimento...",
                date = "2024-01-10",
                author = "NetBridge Team"
            },
            new {
                id = 3,
                title = "React e .NET: Integração Perfeita",
                description = "Melhores práticas para integrar frontend React com backend .NET.",
                content = "A combinação de React no frontend com .NET no backend oferece...",
                date = "2024-01-05",
                author = "NetBridge Team"
            }
        };

        var lastPosts = posts.Select(p => new { p.id, p.title, p.date }).Take(10).ToList();

        return new OkObjectResult(new { posts = posts, lastPosts = lastPosts });
    }
}


