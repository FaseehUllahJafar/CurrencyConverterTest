using System.Diagnostics;
using System.Security.Claims;
using Serilog.Context;

namespace CurrencyConverter.Api.Middleware
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestLoggingMiddleware> _logger;

        public RequestLoggingMiddleware(
            RequestDelegate next,
            ILogger<RequestLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            var stopwatch = Stopwatch.StartNew();

            var clientIp = context.Connection.RemoteIpAddress?.ToString();
            var method = context.Request.Method;
            var endpoint = context.Request.Path;
            var correlationId = context.TraceIdentifier;

            var clientId =
                context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? context.User?.FindFirst("sub")?.Value
                ?? context.User?.FindFirst("client_id")?.Value
                ?? "anonymous";

            using (LogContext.PushProperty("CorrelationId", correlationId))
            using (LogContext.PushProperty("ClientIP", clientIp))
            using (LogContext.PushProperty("ClientId", clientId))
            using (LogContext.PushProperty("HttpMethod", method))
            using (LogContext.PushProperty("Endpoint", endpoint))
            {
                try
                {
                    await _next(context);
                }
                finally
                {
                    stopwatch.Stop();

                    var statusCode = context.Response.StatusCode;
                    var elapsedMs = stopwatch.ElapsedMilliseconds;

                    _logger.LogInformation(
                        "HTTP {Method} {Endpoint} responded {StatusCode} in {ElapsedMilliseconds}ms",
                        method,
                        endpoint,
                        statusCode,
                        elapsedMs);
                }
            }
        }
    }
}
