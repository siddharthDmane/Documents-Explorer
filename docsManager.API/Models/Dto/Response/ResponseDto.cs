namespace docsManager.API.Models.Dto.Response
{
    public class ResponseDto
    {
        public int Status { get; set; }
        public string Message { get; set; }
    }
}

// Ok             ==> 200
// Already Exist  ==> 300
// Bad Parameter  ==> 400
// Not Found      ==> 404
// Internal Error ==> 500