using System.Net.Http.Headers;
using Firebase.Auth;
using Firebase.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using HttpServerUtility = System.Web.HttpUtility;
namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly Context _context;

        private readonly IConfiguration _configuration;
        private readonly IHostEnvironment _env;

        public FilesController(IConfiguration configuration, Context context, IHostEnvironment env)
        {
            _context = context;
            _env = env;
            _configuration = configuration;
        }



        [HttpPost, Authorize]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {

            if (file.Length > 0)
            {

                    var stream = file.OpenReadStream();
                        
                    var API = new FirebaseAuthProvider(new FirebaseConfig(_configuration.GetSection("FireBase:apiKay").Value));

                    var user = await API.SignInWithEmailAndPasswordAsync(_configuration.GetSection("Admin:Email").Value,
                    _configuration.GetSection("Admin:Password").Value);

                    var cancellation = new CancellationTokenSource();

                    var UploadFile = new FirebaseStorage(
                        _configuration.GetSection("FireBase:storageBucket").Value,
                        new FirebaseStorageOptions
                        {
                            AuthTokenAsyncFactory = () => Task.FromResult(user.FirebaseToken),
                            ThrowOnCancel = true
                        }
                    ).Child("images").Child($"{file.FileName}")
                    .PutAsync(stream, cancellation.Token);


                    try
                    {
                        await UploadFile;
                        return Ok();
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.Message);
                        return BadRequest();
                    }
                    finally
                    {
                        stream.Close();
                    }
                }
            else
            {
                return Content("file not selected");
            }

        }
    }
}