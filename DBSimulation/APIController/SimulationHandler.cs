namespace DBSimulation.APIController;
using Computing;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("APIController/[controller]")]
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