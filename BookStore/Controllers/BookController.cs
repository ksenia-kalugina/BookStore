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
        readonly string path = @"wwwroot\bookBD.csv";
        List<Book> books = new List<Book>();        

        public BookController()
        {
            try
            {
                using StreamReader sr = new StreamReader(path, System.Text.Encoding.Default);
                string line;
                while ((line = sr.ReadLine()) != null)
                {
                    String[] words = line.Split(';');
                    Book book = new Book
                    {
                        id = words[0],
                        title = words[1],
                        publisher = words[2],
                        price = Convert.ToDouble(words[3]),
                        active = Convert.ToBoolean(Convert.ToInt32(words[4]))
                    };
                    this.books.Add(book);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
        [HttpGet("[action]")]
        public IEnumerable<Book> Get()
        {            
            return this.books.ToList();
        }
       
        [HttpPost("[action]")]
        public async Task<IActionResult> Post([FromBody]Book[] books)
        {
            if (books == null)
            {
                return BadRequest();
            }

            foreach(var book in books)
            {
                this.books.Add(book);
            }            
            string textToFile = "";
            for (int i = 0; i < books.Length; i++)
            {
                int active = 0;
                if (books[i].active)
                  active = 1;
                textToFile += "\n" + books[i].id + ";" + books[i].title + ";" + books[i].publisher + ";" + books[i].price + ";" + active + ";";
            }
            try
            {
                string textFromFile = "";
                using (StreamReader sr = new StreamReader(path, System.Text.Encoding.Default))
                {
                    textFromFile= sr.ReadToEnd();                    
                }
                using (StreamWriter sw = new StreamWriter(path, false, System.Text.Encoding.Default))
                {
                    sw.Write(textFromFile);
                    sw.Write(textToFile);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            return Ok();
        }
    }
}