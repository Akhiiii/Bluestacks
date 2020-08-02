/* Manange Campaign Ui  to display listing of campaign according to status(upcoming,live,past) */

import React,{ Component } from 'react';
import {Button,Table,Tabs,DatePicker,Modal,ConfigProvider,Select} from 'antd';
import 'antd/dist/antd.css'; 
import '../styles/styles.css'           // imported css file
import moment from 'moment';
import enUS from 'antd/es/locale-provider/en_US';
import de_DE from 'antd/es/locale-provider/de_DE';
import data from '../data/data.json';  
import 'moment/locale/zh-cn';

moment.locale('en');
const { TabPane } = Tabs;
const { Option } = Select;
var Data = data.data;                 // dummy json
var List=[];
class Campaigns extends Component {
    constructor(props) {
        super(props);
        this.state = {                    // state
            UpcomingList:[],
            LiveList:[],
            PastList:[],
            key:2,
            loading : false,
            visible: false,
            locale: enUS,
        };           
    }
    callback=(key) =>{ this.setState({key});}  // setting current active tab key

    componentWillMount() {                     // will  call once before render
        this.setState({loading:true});
        this.update_data();  
    }
    update_data = ()=>{                         // update data accroding to status (upcoming,past,live)
        var Upcoming = [],Live=[],Past=[];
           for(var i = 0;i<Data.length;i++){
               var date = new Date(Data[i].createdOn);
               var today = new Date();
               var diff = date.getTime() - today.getTime();
               diff = Math.ceil(diff/(1000 * 3600 * 24));
               if(diff===0){
                   Live.push(Data[i]);
               }
              else if(diff>0){
                Upcoming.push(Data[i]);
               }
              else{
                   Past.push(Data[i]);
               }
            }
           this.setState({UpcomingList: Upcoming,PastList:Past,LiveList:Live,loading : false});
    }
    handleLangChange=(value)=> {
        console.log(`selected ${value}`);
        this.setState({ locale: value });
    }
    onChange(date,record) {                       // functionility of reschedule a campaign 
        var selected_date = new Date(date);
        var tmp = [];
        for(var i = 0;i<Data.length;i++){
            var obj ={};
            obj.name = Data[i].name;
            obj.region = Data[i].region;
            obj.price = Data[i].price;
            obj.csv =  Data[i].csv;
            obj.report =  Data.report;
            obj.image_url =  Data[i].image_url;
            if(Data[i].name === record.name){
                obj.createdOn = selected_date.getTime();
            }else{
                obj.createdOn = Data[i].createdOn;
            }
            tmp.push(obj);
        }
        Data = tmp;
        this.setState({loading:true});
        this.update_data();                // call to update tab wise data
      }
  render(){
      if(this.state.key == 1){ List= this.state.UpcomingList;}
      else if(this.state.key == 2){ List= this.state.LiveList;}       // setting table data source according to current active key
      else{List= this.state.PastList;}
      const columns = [                   // table columns
        {
          title: 'DATE',
          dataIndex: 'createdOn',
          render: (text, record) => {                       // conditions  for date text to be shown according to date
            var date = new Date(record.createdOn);
            var today = new Date();
            var diff = date.getTime() - today.getTime();
            diff = Math.ceil(diff/(1000 * 3600 * 24));
            var diff_txt="";
            if(diff===0){ diff_txt = "today"}
            if(diff>0){
                if(diff == 1)
                    diff_txt = "tomorrow";
                else
                    diff_txt = Math.abs(diff)  + " Days Ahed"
                
            }
            if(diff<0){
                if(diff == -1)
                    diff_txt = "yesterday"
                else
                    diff_txt = Math.abs(diff) + " Days Ago"
            }
            return (<div>
                    <div className="date_bold_txt">{moment(date).format('MMM YYYY,DD')}</div>
                    <div className="date_thin_txt">{diff_txt}</div>
                </div>);
        },
        },
        {
          title: 'CAMPAIGN',
          dataIndex: 'name',
          render: (text, record) => {
              return (<div style={{display:'flex'}}>
                   <img  src={require('../assets/Bitmap.png')} style={{ width: '40px', height: '40px' }} />&nbsp;&nbsp;&nbsp;
                   <div>
                        <div className="name_bold_txt">{record.name}</div>
                        <div className="name_thin_txt">{record.region}</div>
                  </div>
              </div>);
          }
        },
        {
          title: 'VIEW',
          dataIndex: 'price',
          render: (text, record) => {
            return (<div onClick={()=>this.setState({visible:true,name:record.name,region:record.region})} style={{display:'flex'}}>
                 <img  src={require('../assets/Price.png')} style={{ width: '24px', height: '24px' }} />&nbsp;&nbsp;&nbsp;
                <div className="actions_text" style={{marginTop:'1%'}}>View Pricing</div>
            </div>);
        }
        },
        {
          title: 'ACTION',
          render: (text, record) => (
            <div className="actions_text" style={{display:'flex'}}>
              <img  src={require('../assets/file.png')} style={{ width: '18px', height: '24px' }} />&nbsp;
              <div  style={{marginTop:'1%'}}> CSV </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <img  src={require('../assets/statistics-report.png')} style={{ width: '18px', height: '24px' }} />&nbsp;
              <div  style={{marginTop:'1%'}}> Report </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <img  src={require('../assets/calendar.png')} style={{ width: '18px', height: '24px' }} />&nbsp;
              <DatePicker
                placeholder="Schedule Again"
                onChange={(date)=>this.onChange(date,record)}
                allowClear={false}
                suffixIcon
                bordered={false}
            />
            </div>
          ),
        },
      ];
  const ModalView = () =>{                        // modal UI for View Pricing
    return (<Modal
        closable ={false}
        footer={null}
        width={400}
        visible={this.state.visible}
  >
   <div >
       <div>
       <div style={{display:'flex'}}>
            <img  src={require('../assets/Bitmap.png')} style={{ width: '137px', height: '137px' }} />&nbsp;&nbsp;&nbsp;&nbsp;
            <div style={{marginTop:'30%'}}>
                <div className="modal_bold_txt">{this.state.name}</div>
                <div className="name_thin_txt">{this.state.region}</div>
            </div>
        </div>
        <div>
            <div className="modal_heading_txt" style={{marginTop:'20px'}}>Pricing</div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:17}}>
                <p className="para_small_txt">1 Week - 1 Month</p>
                <p className="para_bold_txt">$ 100.00</p>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:17}}>
                <p className="para_small_txt">6 Months</p>
                <p className="para_bold_txt">$ 500.00</p>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:17}}>
                <p className="para_small_txt">1 Year</p>
                <p className="para_bold_txt">$ 900.00</p>
            </div>
            <div style={{display:'flex',justifyContent:'center',marginTop:50}}>
                <Button  onClick={()=>this.setState({visible:false})} className="btn">Close</Button>
            </div>
        </div>
       </div>
   
  </div>
  </Modal>);
  }
  const TableView = ()=> {              // table component 
    return (
      <Table   loading={this.state.loading} pagination={false} style={{marginTop:'40px'}} columns={columns} dataSource={List} />
      );
  }
    return(
          <div>
            <Select defaultValue="en_US" style={{ width: 120 }} onChange={this.handleLangChange}>
                <Option value={enUS}>English</Option>
                <Option value={de_DE}>German</Option>
            </Select>
            <div style={{padding:40}}>
        <div className="head_text">Manage Campaigns</div>
            <ModalView />
            <Tabs  value="zh-cn" className="tab_text" style={{marginTop:'40px'}} defaultActiveKey="2" onChange={this.callback}>
                <TabPane tab="Upcoming Campaigns" key="1"><TableView/></TabPane>
                <TabPane tab="Live Campaigns" key="2"><TableView/></TabPane>
                <TabPane tab="Past Campaigns" key="3"><TableView/></TabPane>
            </Tabs>
      </div>
      <ConfigProvider locale={this.state.locale}>
          <Campaigns
            key={this.state.locale ? this.state.locale : 'en' /* Have to refresh for production environment */}
          />
        </ConfigProvider>
      </div>
        
    )
  }
}
export default Campaigns;