using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;


namespace BookStore.Controllers
{
    [ApiController]
    [Route("api/books")]
    public class BookController : Controller
    {
        Book[] books;
        public BookController()
        {
            books = new Book [] { 
                new Book { id = "1", title = "qwqwqw", publisher = "asasas", price = 123.2, active = true}, 
                new Book { id = "2", title = "qwqwqw", publisher = "asasas", price = 123.2, active = true },
                new Book { id = "3", title = "qwqwqw", publisher = "asasas", price = 123.2, active = true }, 
                new Book { id = "4", title = "qwqwqw", publisher = "asasas", price = 123.2, active = true }, 
                new Book { id = "5", title = "qwqwqw", publisher = "asasas", price = 123.2, active = true }
            };
        }
        [HttpGet]
        public IEnumerable<Book> Get()
        {
            return books.ToList();
        }
    }
}