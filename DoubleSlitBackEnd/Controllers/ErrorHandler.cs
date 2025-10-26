using Microsoft.AspNetCore.Mvc;
using DoubleSlitBackEnd.Computing;

namespace DoubleSlitBackEnd.Controllers;

[ApiController]
[Route("[controller]")]
public class ErrorHandler : ControllerBase
{
    [HttpPost]
    public IActionResult Post([FromBody] SimulationParameters parameters)
    {
        var simulator = new DoubleSlitSimulator(parameters);
        var result = simulator.RunError();
        
        return Ok(result);
    }
}