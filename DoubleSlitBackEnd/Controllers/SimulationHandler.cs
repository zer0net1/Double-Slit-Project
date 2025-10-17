using Microsoft.AspNetCore.Mvc;
using DoubleSlitBackEnd.Computing;

namespace DoubleSlitBackEnd.Controllers;

[ApiController]
[Route("[controller]")]
public class SimulationHandler : ControllerBase
{
    [HttpPost]
    public IActionResult Post([FromBody] SimulationParameters parameters)
    {
        var simulator = new DoubleSlitSimulator(parameters);
        var result = simulator.Run();
        
        return Ok(result);
    }
}