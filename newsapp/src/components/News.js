import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {
    static defaultProps = {
        country : 'us',
        pageSize : 5,
        category : 'general'
    }

    static propTypes = {
        country : PropTypes.string,
        pageSize : PropTypes.number,
        category : PropTypes.string
    }
    capitalizeFirstLetter = (val) => {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    constructor(props){
        super(props);
        console.log("hello i am constructor");
        this.state = {
            articles : [] ,
            loading : true ,
            page : 1 ,
            totalResults : 0
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsApp` ;
    }

    async updateNews(){
        this.props.setProgress(0);
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=5a5d688983744b5186aafe498c251248&page=${this.state.page}&pageSize=${this.props.pageSize}` ;
        this.setState({loading:true});
        let data = await fetch(url);
        let parsedData = await data.json()
        console.log(parsedData);
        this.setState({
            articles : parsedData.articles,
            totalResults : parsedData.totalResults,
            loading : false 
        })
        this.props.setProgress(0);
    }


    async componentDidMount(){
        
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=5a5d688983744b5186aafe498c251248&page=1&pageSize=${this.props.pageSize}` ;
        this.setState({loading:true});
        let data = await fetch(url);
        let parsedData = await data.json()
        console.log(parsedData);
        this.setState({
            articles : parsedData.articles,
            totalResults : parsedData.totalResults,
            loading : false ,
        })
    }

    handlePrevClick = async () => {
        // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=5a5d688983744b5186aafe498c251248&page=${this.state.page - 1}&pageSize=${this.props.pageSize}` ;
        // this.setState({loading:true});
        // let data = await fetch(url);
        // let parsedData = await data.json()
        // console.log(parsedData);
        

        // this.setState({
        //     page : this.state.page-1 ,
        //     articles :parsedData.articles,
        //     loading : false 
        // })
        this.setState({page : this.state.page - 1})
        this.updateNews()

    }

    handleNextClick = async () => {
    //     if(!(this.state.page+1 > Math.ceil(this.state.totalResults/this.props.pageSize))){
    //         let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=5a5d688983744b5186aafe498c251248&page=${this.state.page + 1}&pageSize=${this.props.pageSize}` ;
    //         this.setState({loading:true});
    //         let data = await fetch(url);
    //         let parsedData = await data.json()
    //         console.log(parsedData);
    //         this.setState({ 
    //             page : this.state.page+1 ,
    //             articles :parsedData.articles,
    //             totalResults : parsedData.totalResults,
    //             loading : false 
    //     })
    // }    
    this.setState({page : this.state.page + 1})
    this.updateNews()
}

fetchMoreData = async () => {
    this.setState({page: this.state.page+1})
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=5a5d688983744b5186aafe498c251248&page=${this.state.page}&pageSize=${this.props.pageSize}` ;
        let data = await fetch(url);
        let parsedData = await data.json()
        console.log(parsedData);
        this.setState({
            articles : this.state.articles.concat(parsedData.articles),
            totalResults : parsedData.totalResults
        })
    };

    render() {
        return (
        <div className='container my-3'>
            <h1 className='text-center' style={{margin : '35px 0px'}}>News App : Top Headlines</h1>
            {this.state.loading  && <Spinner/>}
            <InfiniteScroll
            dataLength={this.state.articles.length}
            next={this.fetchMoreData}
            hasMore={this.state.articles.length !== this.state.totalResults}
            loader={<Spinner/>}
        >  
            <div className='container'>
            <div className='row'>
            { this.state.articles.map( (element)=>{
                return <div className='col-md-4 ' key = {element.url}>
                <NewsItem  title= {element.title?element.title.slice(0,44) : ""} description = {element.description?element.description.slice(0,88):""} imageUrl= {element.urlToImage} newsUrl = {element.url} author = {element.author} date={element.publishedAt} source= {element.source.name}/>
                </div>
            })}
        </div>
        </div>
        </InfiniteScroll>
        </div>
    )
}
}

export default News
