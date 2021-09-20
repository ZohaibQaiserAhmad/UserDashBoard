//import statements
import axios from "axios";
import React from 'react';

//import styles
import '../Styles/styles.css'

function sortByValue(a,b,sortBy){
    if(a[sortBy].toLowerCase() < b[sortBy].toLowerCase()) return -1;
    if(a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
    return 0;
}


//Export the User List Page
export default class UserList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          Data : [],
          filteredData : [],
          SortBy: 'name',
          ScreenWidth : window.innerWidth
        }

        this.handleSearch = this.handleSearch.bind(this);
        this.handleSortBy = this.handleSortBy.bind(this);
  
      }


    //Gather data from jsonplaceholder
    async fetchData(){

        var sortBy = this.state.SortBy;
        axios.get('http://jsonplaceholder.typicode.com/users').then(res => {
            this.setState({Data : res.data.sort((a,b) => sortByValue(a,b,sortBy)), SortBy : 'name'}, () => {
                //have filtered data and data be the same , data will be a reference when search is empty
                console.log(this.state.Data)
                this.setState({filteredData : this.state.Data})
            });
        })
    }

    handleSearch = e => param =>{ 

        this.setState({ filteredData : this.state.Data.filter(person => {
            const query = param.target.value.toLowerCase();
            return (
                person.name.toLowerCase().indexOf(query) >= 0 ||
                person.username.toLowerCase().indexOf(query) >= 0 ||
                person.email.toLowerCase().indexOf(query) >= 0
            )
        
        }).sort((a,b) => sortByValue(a,b,this.state.SortBy))}, () => {

            console.log(this.state.SortBy);

        }); 
      }


    handleSortBy = e => param => {
        
        var sortBy = param.target.value;
        this.setState({Data : this.state.filteredData.sort((a,b) => sortByValue(a,b,sortBy)) , SortBy : param.target.value}, () => {
            console.log(this.state.SortBy);
        }); 
    }
    

    //Handle Screen Size Changes
    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth });
      };


     //Default
     componentDidMount(){
        window.addEventListener('resize', this.handleWindowSizeChange);
        this.fetchData(); 
      }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
      }


      render() {

        const { width } = this.state;

        //Dictate SmallScreen to be width <= 500
        const smallScreen = width <= 500;

        if(smallScreen){

            return (
                <form>
                <h1>Users</h1>
                <p>Search</p>
                <input
                    type="text"
                    className = "searchSmall"
                    onChange = {(this.handleSearch('Search'))}
                />

                <p>Sort By </p>
                <select  className = "selectSmall"  aria-label="Disabled select example"  onChange = {(this.handleSortBy('SortBy'))}>
                    <option value="name">Name</option>
                    <option value="username">UserName</option>
                    <option value="email">Email</option>
                </select>
                {this.state.filteredData.map((person, index) => (
                    
                    <div key={index} className = 'peopleSmall'>
                    <div className  = "circle"></div>
                    <li className = "personList">{person.name}</li>
                    <li className = "personList">{person.username}</li>
                    <li className = "personList"><a href={`mailto:${person.email}`}>{person.email}</a> </li>
                    </div>
                ))}


                </form>

                
            )
        }
        else{
            return(
                <form>
                <div className = 'container'>
                    <h1>Users</h1>
                    <p className = "positionSearch">Search</p>
                    <input
                        type="text"
                        className = "searchBig"
                        onChange = {(this.handleSearch('Search'))}
                    />
                    <p className = "positionSortBy">Sort By</p>
                    <select  className = "selectBig"  aria-label="Disabled select example"  onChange = {(this.handleSortBy('SortBy'))}>
                        <option value="name">Name</option>
                        <option value="username">UserName</option>
                        <option value="email">Email</option>
                    </select>
                </div>
                {this.state.filteredData.map((person, index) => (
                    <div key={index} className = 'peopleBig'>
                    <div className  = "circle"></div>
                    <li className = "personList">{person.name}</li>
                    <li className = "personList">{person.username}</li>
                    <li className = "emailBig"><a href={`mailto:${person.email}`}>{person.email}</a> </li>
                    </div>
                ))}

                </form>

            )
        }
      }


}