var PORT = 8000;
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var ejs = require('ejs');
var app = express();
var mongoose = require("mongoose");
var print = (str) => console.log(str);

mongoose.connect('mongodb://localhost/my_first_database', {
    useMongoClient: true,
});

var QuoteSchema = new mongoose.Schema({
    quotation: {type: String},
    name: {type: String},
}, {timestamps: true});
mongoose.model('Quote', QuoteSchema);

mongoose.Promise = global.Promise;
var Quote = mongoose.model('Quote');

app.use(bodyParser.urlencoded({extended: true}));
// app.use(session({secret: 'mi_p@55w0rd_3S_muy_r@nd0m050!!y_muy_1337_t@mbi3n'}));

app.use(express.static('static'));

app.set('views', __dirname + '/views');
app.set('viewengine', 'ejs');


app.get('/', function (req, res){
    res.render('index.ejs', {errors: []});
});

app.get('/quotes', function(req, res){
    console.log("GET /quotes request ");
    Quote.find({}, function(err, rvals){
        res.render("quotes.ejs", {errors: [], quotes: rvals})});
    });

app.post('/quotes', function (req, res){
    var quote = new Quote({name: req.body.name, quotation: req.body.quote});
    print('QUOTE VAR: ');
    print(quote);
    quote.save(function (err){
        if (err){
            console.log("went wrong!?", err);
            res.render("quotes.ejs", {errors: ['DEBUGGING NEEDED', err]})
        }
        else {
            console.log("success - added quote");
            res.redirect('/quotes');            
        }
    })

});
  
app.listen(PORT, function(){
    console.log('listening on port '+PORT);
})
