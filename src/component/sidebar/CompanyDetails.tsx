import React, {useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CompanyDetails.css';
import { useEffect } from 'react';
import axiosInstance from '../../api/api'
import { useState } from 'react';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";
import cancel from '../icons/cancel.svg';
import { Paginator } from 'primereact/paginator';
import Modal from 'react-modal';
import { Toast } from 'primereact/toast';
import edit from '../icons/edit.svg';
import { Formik } from 'formik';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-20%',
      transform             : 'translate(-50%, -50%)',
      width                 : '32.25rem',
    }
  };

const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: transparent;
  top:40%;
  margin-left:-16%;
`;

let CompanyDetails=()=> {
  //let history = useHistory();
  const initialFormData = Object.freeze({
    offset: 0,
    perPage: 10,
    totalRecords: 0,
    pageCount:0

});
  const [formData, setFormData]:any = useState(initialFormData);
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState<any>(false);
  const [cus_no, setCus_no] = useState<any>('');
  const [last_name, setLast_name] = useState<any>('');
  const [modalIsOpen, setmodalIsOpen] = useState<any>(false);
  const [editLocation, seteditLocation] = useState<any>({});
  const myToast: any = useRef(null);
  const fetchDataAsync = async () => {
    try {
        setLoading(true);
        const api = '/api/customer/company/details/';
        let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
        setData(response.data.data);
        let slice = response.data.data.slice(formData.offset, formData.offset + formData.perPage);
        setFormData({...formData, pageCount: Math.ceil(response.data.data.length / formData.perPage), totalRecords: response.data.data.length});
        setTableData(slice);
        setCus_no(response.data.cus_no);
        setLast_name(response.data.last_name);
        if(!(data===null)){
            setLoading(false);
          }
        return data;
    }catch(error){
        setLoading(false);
        throw error;
    }
  }   ;

  useEffect(() =>{
     fetchDataAsync()
  },[]);

  const updateLocation =   (location: any, address: any) => {
    const api = '/api/customer/company/update_details/'+editLocation.customer_no+'/'+editLocation.location_no;
    let data= {location: location, address: address}
    let response = axiosInstance.post(api,data).then((res: any) => {
      if(res.error){
        showToast('error', "Error Message","Location has not been updated");
        return 0
      }
      showToast('success', "Success Message","Location has been updated");
      fetchDataAsync();
    }).catch(err => {
      showToast('error', "Error Message","Location has not been updated");
    })
    setmodalIsOpen(false);
  }

  const showToast = (severityValue: any, summaryValue: any, detailValue: any) => {   
    myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
  }

  
  const renderModal = () =>{ 
    return(
        <>
        <div style={{overflow:'hidden'}}>
        <div style={{textAlign:'right'}} >
           <img alt="cancel" style={{width:'1.875rem',cursor:'pointer'}} onClick={closeModal} src={cancel}/>
        </div>
        <Formik
          initialValues={{ location: editLocation.location, address: editLocation.address }}
          validate={values => {
            var errors: any = {}
            if (!values.location) {
              errors['location'] = 'Required';
            }
            if (!values.address) {
              errors['address'] = 'Required';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            updateLocation(values.location, values.address)
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Location</label>
                <input type="location" name="location" 
                    className="form-control"
                    placeholder="Enter location"
                    onChange={handleChange}
                    value={values.location}
                  />
                <small id="locationHelp" className="form-text text-muted text-danger">{errors.location}</small>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="address" name="address" 
                    className="form-control"
                    placeholder="Enter address"
                    onChange={handleChange}
                    value={values.address}
                  />
                <small id="addressHelp" className="form-text text-muted text-danger">{errors.address}</small>
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={errors.address != undefined || errors.location != undefined}>
                Submit 
              </button>
            </form>
          )}
        </Formik>
        </div>
        </>
    )
  }

  const noPermission = () =>{
    showToast('error','Error Message',`You don't have permission`);
  }

  const location = (id: any) => {
    var result  = tableData.filter(function(o: any){return o.location_no == id;} );
    var foundLoc = result? result[0] : null
    seteditLocation(foundLoc)
    setmodalIsOpen(true)
  }

  
  const closeModal = () =>{
    setmodalIsOpen(false)
  }

  const onPageChange = (event:any) => {
    let offset = event.first;
    let perPage = event.rows;
    setFormData({...formData , offset:offset, perPage:perPage})
    let slice = data.slice(offset, offset + perPage);
    setTableData(slice);
}
 
      return (
        <>
         <div>
               {loading ?<div className='overlay-box1'>
                    <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={loading}  height={30} width={5} radius={2} margin={20} />
                </div> : ''}
                <Modal style={customStyles} isOpen={modalIsOpen} onRequestClose={closeModal}>{renderModal()}</Modal>
                <Toast ref={myToast} /> 
                <section className="overview">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12">
                                <h6 className="over-text">Company Locations</h6>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="filter-pannel">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="filter-pannel-inner d-flex justify-content-between flex-wrap">
                                    <div>
                                        <h6>{last_name}</h6>
                                        <h6>{cus_no}</h6>
                                    </div>
                                
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
    
                <div className="container-fluid">
                  <div className="row">
                      <div className="col-lg-12">
                          <div className="overview-pannel-cal">
                              <div className="overview-pannel-header">
                                  Locations
                              </div>
                              <div className="overview-pannel-body table-responsive-sm">
                                <table  className="table mb-0 estimates-table">
                                  <thead className="thead-light">
                                      <tr >
                                      
                                      <th scope="col">Location Name</th>
                                        <th scope="col" className="text-center">Address</th>
                                        <th scope="col" className="text-right pr-4">Actions</th>
                                        </tr>
                                  </thead>
                                  <tbody>
                                    {tableData.map((item: any,i: any)=>{
                                    return(
                                        <>
                                    <tr key={i}>
                                    <td>{item.location}</td>
                                    <td className="text-center">{item.address}</td>
                                    <td className="text-right general-btn"  >
                                        <button className="btn blue-btn"  
                                        onClick={(localStorage.getItem('service_request')=== 'true')? ()=>location(item.location_no) : noPermission}
                                        >Update</button>
                                    </td>
                                    </tr>
                                    
                                    </>
                                    )})}
                                  </tbody>
                              </table>
                        
                              </div>
                              <Paginator first={formData.offset} rows={formData.perPage} totalRecords={formData.totalRecords} rowsPerPageOptions={[10,20,30]} 
                                  template="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink "
                                  onPageChange={onPageChange}></Paginator>
                                    
                          </div>
                      </div>
                  </div>
                </div>
            </div>
        </>
      );
    }

export default CompanyDetails;  