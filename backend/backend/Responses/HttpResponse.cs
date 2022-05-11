namespace backend.Responses
{
    //Base Model for our Controller responses
    //Any accessable HTTP Method in a controller needs to return one of these so that our client knows exactly what to expect
    //Can optionally be typed with a response Model (e.g. HttpResponse<DepositResponse>)
    public class HttpResponse
    {
        public string Message { get; set; }

        public HttpResponse()
        {
            Message = "success";
        }
    }

    public class HttpResponse<T> : HttpResponse
    {        
        public T? Body { get; set; }
    }
}
