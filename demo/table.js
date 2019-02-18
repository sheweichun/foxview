// import {html,defineWebComponent as defineComponent,WebComponent as Component,render,property} from 'illidan';
import {html,defineComponent,Component,render} from 'illidan';
function property(){}

import getData from './getData'

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};


const Columns = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i'
]

function generateTableData(rows){
    let result = [];
    for(let i = 0; i < rows; i++){
        const row = [];
        for(let j = 0; j < Columns.length; j++){
            row.push(Math.floor(Math.random() * 10000))
        }
        result.push(row)
    }
    return result;
}


class Query extends Component{
    lpad(padding, toLength, str) {
      return padding.repeat((toLength - str.length) / padding.length).concat(str);
    };
  
    formatElapsed(value) {
      var str = parseFloat(value).toFixed(2);
      if (value > 60) {
          minutes = Math.floor(value / 60);
          comps = (value % 60).toFixed(2).split('.');
          seconds = this.lpad('0', 2, comps[0]);
          ms = comps[1];
          str = minutes + ":" + seconds + "." + ms;
      }
      return str;
    };
    
    render() {
      var className = "elapsed short";
      if (this.props.elapsed >= 10.0) {
          className = "elapsed warn_long";
      } else if (this.props.elapsed >= 1.0) {
          className = "elapsed warn";
      }
  
      return html`<td class="Query ${className}">
          ${this.props.elapsed ? this.formatElapsed(this.props.elapsed) : '-'}
          <div class="popover left">        
            <div class="popover-content">${this.props.query}</div>
            <div class="arrow"/>
          </div>
        </td>`
    };
}
__decorate([
  property()
], Query.prototype, "elapsed", void 0);
__decorate([
  property()
], Query.prototype, "query", void 0);
__decorate([
  property()
], Query.prototype, "key", void 0);
defineComponent('my-query',Query)

class Database extends Component{
      
    sample(queries, time) {
      var topFiveQueries = queries.slice(0, 5);
      while (topFiveQueries.length < 5) {
        topFiveQueries.push({ query: "" });
      }

      var _queries = [];
      topFiveQueries.forEach(function(query, index) {
        _queries.push(html`
          <my-query
            key=${index}
            query=${query.query}
            elapsed=${query.elapsed}
          />
        `);
      });

      var countClassName = "label";
      if (queries.length >= 20) {
        countClassName += " label-important";
      }
      else if (queries.length >= 10) {
        countClassName += " label-warning";
      }
      else {
        countClassName += " label-success";
      }

      return html`
        <td class="query-count" key="1">
          <span class="${countClassName}">
            ${queries.length}
          </span>
        </td>
        ${_queries}
      `;
    };

    render() {
        var lastSample = this.props.samples[this.props.samples.length - 1];

        return html`
          <tr key="${this.props.dbname}">
            <td class="dbname">
              ${this.props.dbname}
            </td>
            ${this.sample(lastSample.queries, lastSample.time)}
          </tr>
        `;
    };
};

__decorate([
  property()
], Database.prototype, "key", void 0);
__decorate([
  property()
], Database.prototype, "dbname", void 0);
__decorate([
  property()
], Database.prototype, "samples", void 0);
defineComponent('my-database',Database)






class Table extends Component{
    constructor(props) {
        super(props);
        this.state = {
            databases : {}
        }
    }
    loadData(){
        var newData = getData(this.props.rows || this.rows);
        Object.keys(newData.databases).forEach(function(dbname) {
        var sampleInfo = newData.databases[dbname];
        if (!this.state.databases[dbname]) {
            this.state.databases[dbname] = {
            name: dbname,
            samples: []
            }
        }

        var samples = this.state.databases[dbname].samples;
        samples.push({
            time: newData.start_at,
            queries: sampleInfo.queries
        });
        if (samples.length > 5) {
            samples.splice(0, samples.length - 5);
        }
        }.bind(this));

        this.setState(this.state);
        setTimeout(()=>{
            this.loadData()
        })
    }
    componentDidMount(){
        this.loadData();
    }
    render(){
        // const {color} = this.props;
        // const {databases} = this.state;
        var databases = [];
        Object.keys(this.state.databases).forEach(function(dbname) {
        databases.push(html`
            <my-database key=${dbname}
            dbname=${dbname}
            .samples=${this.state.databases[dbname].samples} />
        `);
        }.bind(this));
        return html`<div>
        <table class="table table-striped latest-data">
          <tbody>
            ${databases}
          </tbody>
        </table>
      </div>`
        // return html`<table class="table table-striped latest-data">
        //     <tr>
        //         ${Columns.map((name)=>{
        //             return html`<th>${name}</th>`
        //         })}
        //     </tr>
        //     ${data.map((item)=>{
        //         return html`<tr>
        //             ${item.map((val)=>{
        //                 return html`<td>${val}</td>`
        //             })}
        //         </tr>`
        //     })}
        // </table>`
    }
}
__decorate([
  property()
], Table.prototype, "rows", void 0);
defineComponent('my-table',Table)

const rows = 100;

render(html`<my-table rows=${rows}></my-table>`,document.getElementById('table'))