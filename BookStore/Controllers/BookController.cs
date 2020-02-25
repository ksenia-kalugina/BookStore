using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    public class BookController : Controller
    {
        
        List<Book> books = new List<Book>();
        public BookController()
        {
            
        }

        [HttpGet("[action]")]
        public IEnumerable<Book> Get()
        {
            string path = @"wwwroot\bookBD.csv";
            try
            {
                using (StreamReader sr = new StreamReader(path, System.Text.Encoding.Default))
                {
                    string line;
                    while ((line = sr.ReadLine()) != null)
                    {
                        String[] words = line.Split( ';');
                        Book book = new Book { id = words[0], title = words[1], publisher = words[2], price = Convert.ToDouble(words[3]), active = Convert.ToBoolean(Convert.ToInt32(words[4])) };
                        this.books.Add(book);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }


            //Book[] books = new Book[] {
            //    new Book { id = "1", title =text, publisher = "asasas", price = 123.2, active = true},
            //    new Book { id = "2", title = "qwqwqw", publisher = "asasas", price = 123.2, active = true },
            //    new Book { id = "3", title = "qwqwqw", publisher = "asasas", price = 123.2, active = true },
            //    new Book { id = "4", title = "qwqwqw", publisher = "asasas", price = 123.2, active = true },
            //    new Book { id = "5", title = "qwqwqw", publisher = "asasas", price = 123.2, active = true }
            //};
            return this.books.ToList();
        }
    }
}