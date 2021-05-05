import React from 'react';
import {
    Redirect,
  } from "react-router-dom";
  import { Toast } from 'primereact/toast';

import '../login/Login.css'
import axiosInstance , {baseURL} from '../../api/api';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";

const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: transparent;
  top:40%;
  margin-left:-16%;
`;
interface Props{
    data: any;
    loading: boolean;

}
class KeyAuditConfirmation extends React.Component<{},Props> {
  mytoast: React.RefObject<any>;
    constructor(props:Props){
        super(props);
        this.mytoast = React.createRef();
        this.state={
            loading: false,
            data: []
        }
    }

    componentDidMount = async ()=>{
        this.setState({loading: true})
        var props: any = this.props
        var id = props.match.params.id;
        this.getDetails(id)
    }

    confirmKey = async(id: any) => {
        var props: any = this.props
        var key_id = props.match.params.id;
        const api = `/api/kdfinder/audit_report/${key_id}/confirm/${id}`;
        let response = await axiosInstance.post(api , { headers: {'Content-Type': 'application/json',} } );
        if(response.data.success){
            var props: any = this.props
            var id = props.match.params.id;
            this.getDetails(id)
        }
    }

    rejectKey = async(id: any) => {
        var props: any = this.props
        var key_id = props.match.params.id;
        const api = `/api/kdfinder/audit_report/${key_id}/reject/${id}`;
        let response = await axiosInstance.post(api , { headers: {'Content-Type': 'application/json',} } );
        if(response.data.success){
            var props: any = this.props
            var id = props.match.params.id;
            this.getDetails(id)
        }
    }

    getDetails = (id: any) =>{
        const api = `/api/kdfinder/audit_report/${id}`;
        axiosInstance.get(api , { headers: {'Content-Type': 'application/json'} } ).then((response: any) => {
            if(response.data.success){
                this.setState({data: response.data.data, loading: false})
            }else{
                window.location.href = "/"
            }
        }).catch(ee => {
            window.location.href = "/"
        });
        
    }

    render(){
        return(
            <div>
            {
                this.state.loading ? <div className='overlay-box1'  style={{margin:0}}>
                <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={this.state.loading}  height={30} width={5} radius={2} margin={20} />
             </div> :''
            }
            <Toast ref={this.mytoast} />

            <div className="d-flex justify-content-center own-login-container align-items-center">
            
            <table className="table" style={{border :'2px solid #12739A',width:'70%'}} >
            <thead style={{background: 'rgb(18, 115, 154)',color: 'white'}}>
              <tr>
                <th>Key ID Stamp</th>
                <th>Phone </th>
                <th>Email ID </th>
                <th>Issue Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody >
            {this.state.data.map((item: any,i: any)=>{
             return(
              <tr key={i}>
                <td>{item.key_id +" - "+ item.sequence}</td>
                <td>
                    {item.phone}
                </td>
                <td>
                    {item.email}
                </td>
                <td>
                    {item.date_issued}</td>
                <td>
                    <button className="btn btn-success" onClick={() => this.confirmKey(item.id)}>Confirm</button>
                    <button className="btn btn-danger ml-2" onClick={() => this.rejectKey(item.id)}>Reject</button>
                </td>
              </tr>
              )})}
            </tbody>
          </table>
          
                </div>
        </div>
   
        );
    }
}

export default KeyAuditConfirmation;