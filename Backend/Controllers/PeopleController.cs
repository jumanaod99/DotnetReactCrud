using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
namespace Backend.Controllers;

    [ApiController]
    [Route("api/[controller]")]
    public class PeopleController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PeopleController(AppDbContext context){ 
         _context=context;
        }

        [HttpPost]
        public async Task<IActionResult> AddPerson(Person person)
    {
        try{
        _context.People.Add(person);
        await _context.SaveChangesAsync();
        return CreatedAtRoute("GetPerson", new{id=person.Id},person);
        }
        catch(Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);       
        }
    }
       [HttpGet]
        public async Task<IActionResult> GetPeople()
        {
        try
        {
            var people=await _context.People.ToListAsync();
            return Ok(people);
        }
       catch(Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);       
        }
        }
        [HttpGet("{id:int}",Name ="GetPerson")]
        public async Task<IActionResult> GetPerson(int id)
        {
        try
        {
            var person=await _context.People.FindAsync(id);
            if(person is null)
            {
                return NotFound();
            }
            return Ok(person);
        }
       catch(Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);       
        }
        }

        [HttpPut ("{id:int}")]
        public async Task<IActionResult> UpdatePerson(int id,[FromBody] Person person)
        {
        try
        {
            if(id!=person.Id)
            {
                return BadRequest("Id in Url and body mismatches");
            }
            if(!await _context.People.AnyAsync(p=>p.Id==id))
            {
                 return NotFound();
            }
            _context.People.Update(person);
            await _context.SaveChangesAsync();
            return NoContent();
        }
       catch(Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);       
        }
        }

         [HttpDelete ("{id:int}")]
        public async Task<IActionResult> DeletePerson(int id)
        {
        try
        {
            var person=await _context.People.FindAsync(id);
            if(person is null)
            {
                return NotFound();
            }
            _context.People.Remove(person);
            await _context.SaveChangesAsync();
            return NoContent();
        }
       catch(Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);       
        }
        }
        
    }
