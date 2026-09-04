using Backend.Models;
using Microsoft.EntityFrameworkCore;

var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);


builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy  =>
                      {
                          policy.WithOrigins("http://localhost:5173")
                            .AllowAnyMethod()
                            .AllowAnyHeader();
                      });
});
// Add services to the container.

builder.Services.AddControllers();

string ConnectionStrings=builder.Configuration.GetConnectionString
("Default")?? throw new ArgumentNullException("ConnectionStrings is null");
builder.Services.AddDbContext<AppDbContext> (op=>op.UseSqlite
(ConnectionStrings)); 

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");
app.UseCors(MyAllowSpecificOrigins);
//middlewares
app.MapControllers();
app.Run();


