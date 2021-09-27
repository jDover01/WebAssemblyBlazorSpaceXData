using Microsoft.JSInterop;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAssemblyBlazorSpaceX.JSPromiseHandler
{
    public interface IPromiseHandler
    {
        void SetResult(string json);
    }
    public class PromiseHandler : IPromiseHandler
    {
        public TaskCompletionSource<string> tcs { get; set; }

        [JSInvokable]
        public void SetResult(string json)
        {
            // Set the results in the TaskCompletionSource

            tcs.SetResult(json);
        }
    }
}
