using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.Models
{
    public class Book
    {
        public string id { get; set; }
        public string title { get; set; }    
        public string publisher { get; set; } 
        public double price { get; set; }
        public bool active { get; set; }
    }
}
