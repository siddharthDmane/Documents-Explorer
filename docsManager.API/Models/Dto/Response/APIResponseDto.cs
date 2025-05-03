namespace docsManager.API.Models.Dto.Response
{
    public class APIResponseDto<T>
    {
        public int Status { get; set; }
        public string? Message { get; set; }
        public int? TotalCount { get; set; }
        public List<T>? Items { get; set; }
        public T? Item {get;set;}
    }
}
