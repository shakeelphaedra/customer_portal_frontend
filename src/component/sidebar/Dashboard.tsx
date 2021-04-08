import React from "react";
import { Container, Row} from "react-bootstrap";
import { withRouter } from "react-router";
import Sidebarr from "./Sidebarr";
import './Sidebarr.css'
import { Route, Switch } from "react-router";
import AuditReport from "./AuditReport";
import CompanyDetails from "./CompanyDetails";
import ManageUser from "./ManageUser";
import UserInformation from "./UserInformation";
import ViewKeys from "./ViewKeys";
import ViewKeysGroup from "./ViewKeysGroup";
import EditUserInformation from "./EditUserInformation";
import ViewKeysD from "./ViewKeysDetails";
import AddNewUser from "./AddNewUser";
import Accounting from "./Accounting";
import Quotations from "./Quotations";
import ServiceRequest from "./ServiceRequest";
import CompanyDetailsSummary from "./CompanyDetailsSummary";
import SystemNumber from "./SystemNumber";
import NotFound from "../NotFound";

const Dash = () => {
    return (
        <>
            <Container fluid>
                <Row style={{backgroundColor:"#ECECEC"}}> 
                    <div id="sidebar-wrapper">
                        <Sidebarr />
                    </div>
                    <div id="page-content-wrapper">
                        <main>
                            <div className="row" style={{height:'calc(100vh - 7rem)',marginTop:".7rem", overflowX:"hidden"}}>
                                <Switch>
                                    <Route path='/home/companydetails' component={CompanyDetails} />
                                    <Route path='/home/userinformation' component={UserInformation} />
                                    <Route path='/home/accounting' component={Accounting} />
                                    <Route path='/home/estimations' component={Quotations} />
                                    <Route path='/home/servicerequest' component={ServiceRequest} />
                                    <Route path='/home/viewkeys' component={ViewKeys} />
                                    <Route path='/home/viewkeysgroup' component={ViewKeysGroup} />
                                    <Route path='/home/auditreport' component={AuditReport} />
                                    <Route path='/home/manageuser' component={ManageUser} />
                                    <Route path='/home/edituserinformation' component={EditUserInformation} />
                                    <Route path='/home/viewkey-details' component={ViewKeysD} />
                                    <Route path='/home/addnewuser' component={AddNewUser} />
                                    <Route path='/home/companydetailssummary' component={CompanyDetailsSummary} />
                                    <Route path='/home/systemnumber' component={SystemNumber} />
                                    <Route path='*' component={NotFound} />
                                </Switch>
                            </div>
           
                        </main>
                    </div>
                </Row>

            </Container>
        </>
    );
};
const Dashboard = withRouter(Dash);
export default Dashboard;