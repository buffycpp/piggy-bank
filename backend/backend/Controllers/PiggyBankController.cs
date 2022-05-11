using backend.Responses;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using HttpResponse = backend.Responses.HttpResponse;

namespace backend.Controllers
{
    [ApiController]
    public class PiggyBankController : ControllerBase
    {
        //These BuildError methods should normally go into some sort of ControllerBase so that they're available in every controller
        //But since we only have this one Controller, it's fine to let them stay in here
        private HttpResponse<T> BuildError<T>(HttpStatusCode code, string message = "An unknown error occured")
        {
            Response.StatusCode = (int)code;
            return new HttpResponse<T>()
            {
                Message = message
            };
        }

        private HttpResponse BuildError(HttpStatusCode code, string message = "An unknown error occured")
        {
            Response.StatusCode = (int)code;
            return new HttpResponse()
            {
                Message = message
            };
        }

        [EnableCors("Any")]
        [HttpGet("/account-data")]
        public HttpResponse<AccountDataResponse> GetAccountData()
        {
            return new HttpResponse<AccountDataResponse>
            {
                Body = new AccountDataResponse()
                {
                    Balance = Database.Adapter.GetBalance(),
                    SavingsGoal = Database.Adapter.GetSavingsGoal()
                }
            };
        }

        [EnableCors("Any")]
        [HttpGet("/account-history")]
        public HttpResponse<AccountHistoryResponse> GetAccountHistory()
        {
            return new HttpResponse<AccountHistoryResponse>
            {
                Body = new AccountHistoryResponse()
                {
                    History = Database.Adapter.GetTransactionHistory()
                }
            };
        }

        [EnableCors("Any")]
        [HttpPost("/deposit")]
        public HttpResponse<DepositResponse> Deposit(double amount)
        {
            if (amount <= 0)
            {
                return BuildError<DepositResponse>(
                    HttpStatusCode.UnprocessableEntity, 
                    "Amount must be greater than zero"
                );
            }

            if (!Database.Adapter.Deposit(amount)
                || !Database.Adapter.AddTransactionRecord(new TransactionRecord()
                {
                    Amount = amount,
                    When = DateTime.Now,
                }))
            {
                return BuildError<DepositResponse>(HttpStatusCode.InternalServerError);
            }

            return new HttpResponse<DepositResponse>()
            {
                Body = new DepositResponse()
                {
                    HitSavingsGoal = Database.Adapter.GetBalance() >= Database.Adapter.GetSavingsGoal()
                }
            };
        }

        [EnableCors("Any")]
        [HttpPost("/withdraw")]
        public HttpResponse Withdraw(double amount)
        {
            if (amount <= 0)
            {
                return BuildError(
                    HttpStatusCode.UnprocessableEntity,
                    "Amount must be greater than zero"
                );
            }

            if (amount > Database.Adapter.GetBalance())
            {
                return BuildError(
                    HttpStatusCode.UnprocessableEntity,
                    "You don't have that much money to withdraw"
                );
            }

            if(!Database.Adapter.Withdraw(amount)
                || !Database.Adapter.AddTransactionRecord(new TransactionRecord()
            {
                Amount = amount * -1,
                When = DateTime.Now,
            }))
            {
                return BuildError<DepositResponse>(HttpStatusCode.InternalServerError);
            }

            return new HttpResponse();
        }

        [EnableCors("Any")]
        [HttpPost("/update-savings-goal")]
        public HttpResponse UpdateSavingsGoal(double amount)
        {
            if (amount < 0)
            {
                return BuildError(
                    HttpStatusCode.UnprocessableEntity,
                    "Amount must not be smaller than zero"
                );
            }

            //Wasn't defined in the task so i'm leaving it in the comments
            //if (amount < Database.Adapter.GetBalance())
            //{
            //    return BuildError(
            //        HttpStatusCode.UnprocessableEntity,
            //        "You cannot set a savings goal that you have already reached"
            //    );
            //}

            if(!Database.Adapter.SetSavingsGoal(amount))
            {
                return BuildError<DepositResponse>(HttpStatusCode.InternalServerError);
            }

            return new HttpResponse();
        }
    }
}
