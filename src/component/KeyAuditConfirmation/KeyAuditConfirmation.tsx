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

    getDetails = async(id: any) =>{
        const api = `/api/kdfinder/audit_report/${id}`;
        let response = await axiosInstance.get(api , { headers: {'Content-Type': 'application/json'} } );
        if(response.data.success){
            this.setState({data: response.data.data, loading: false})
        }else{
            <Redirect to='/'/>
        }
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

            <div className="d-flex justify-content-center own-login-container">
            
                <form  style={{marginTop:"4.375rem"}}> 
                    <div>
                        {this.state.data.map((obj: any)=> {
                            return (
                                <p><div>
                                    {obj.key_id} - {obj.sequence}
                                    </div></p>
                            )
                        })}
                    </div>
                    <div>
                        <button style={{height:"2.5rem",backgroundColor:"#009ED6"}} className="btn btn-primary">Yes</button>
                        <button style={{height:"2.5rem"}} className="btn btn-danger">No</button>
                    </div>
                </form>
                
                </div>
        </div>
   
        );
    }
}

export default KeyAuditConfirmation;