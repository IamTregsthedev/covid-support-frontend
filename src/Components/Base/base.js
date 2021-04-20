import React from 'react'
import '../Base/style.css'
import Airtable from 'airtable'

import {TwitterTweetEmbed} from 'react-twitter-embed';
import TweetEmbed from 'react-tweet-embed'


class Base extends React.Component
{   

    componentDidMount(){
        this.getLocationData()

    }

    constructor(props)
    {
        super(props);
        this.state = {
            tweets : [],
            locations : []
        }
    }

    getData = async(location) => {
        var base = new Airtable({apiKey: 'keyjeMS3U62hP7wfU'}).base('appDBE3kBD31dL4Cb');
        let tweetss = []
        let randomvar

        base('support').select({
            maxRecords: 1000,
            view: "Grid view",
            filterByFormula: `{Location} = '${location}'`
        }).eachPage(function page(records, fetchNextPage) {
        
            records.forEach(function(record) {
                randomvar = Math.random().toString(36).substring(2);

                console.log('Retrieved', record.get('Location'));
                let tweet = [
                    record.get('Location'),
                    record.get('Tweet'),
                    randomvar
                    
                ]
                tweetss.push(tweet)
            });
        
  
            fetchNextPage();
        
        }, function done(err) {
            if (err) { console.error(err); return; }
        });
        

        

        
        await this.setState({tweets : tweetss})
        await new Promise(r => setTimeout(r, 2000));
       console.log(this.state.tweets)
       this.forceUpdate()

    }

    getLocationData = async() => {
        var base = new Airtable({apiKey: 'keyjeMS3U62hP7wfU'}).base('appDBE3kBD31dL4Cb');
        let locationss = []


        base('support').select({
            maxRecords: 1000,
            view: "Grid view",
        }).eachPage(function page(records, fetchNextPage) {
        
            records.forEach(function(record) {
                console.log('Retrieved', record.get('Location'));
                locationss.push(record.get('Location'))
            });
    
            fetchNextPage();
        
        }, function done(err) {
            if (err) { console.error(err); return; }
        });
        
        let uniqueArray = []

        

        await this.setState({locations : uniqueArray})
        await new Promise(r => setTimeout(r, 2000));
        let len = locationss.length
        for(let i = 0; i < len; i++)
        {
            console.log("hey")
            if (uniqueArray.includes(locationss[i])){
                console.log('duplicate')
                continue;
            }
            else{
                console.log(locationss[i])
                uniqueArray.push(locationss[i])
            }
        }
        await this.setState({locations : uniqueArray})
        await new Promise(r => setTimeout(r, 2000));

       this.forceUpdate()

       console.log(uniqueArray)

    }


    change = () =>{
        let dd = document.getElementById('dd')
        let location = dd.value
        this.getData(location)
    }

    render = () =>
    {   
        let projects=this.state.tweets.map((item,index)=>{
                // Math.random().toString(36).substring(2);
            return <TweetEmbed
                     id = {item[1]}
                     key = {item[2]}
                     options = {{width : 500}}
                    />
            })
        
            let locations=this.state.locations.map((item,index)=>{
                return <option
                         value = {item}
                        >{item}</option>
                })   
             

        return(
            <div className = "main">
                <h1>Unofficial Covid Support</h1>

                <div className = "dd-container">
                <span class="custom-dropdown">
                    <select id = "dd" onChange = {this.change}>
                        {locations}       
                    </select>
                    </span>
                </div>
                
                
                <div id = "container" className="container">
                    {projects}
                </div>
            </div>
        )
    }
}

export default Base;