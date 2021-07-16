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
import AuditKeys from "./AuditKeys";
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
        <section className="mainblock">
            <Sidebarr />

			<section className="overview">
				<div className="container-fluid">
                                <Switch>
                                    <Route path='/home/companydetails' component={CompanyDetails} />
                                    <Route path='/home/userinformation' component={UserInformation} />
                                    <Route path='/home/accounting' component={Accounting} />
                                    <Route path='/home/estimations' component={Quotations} />
                                    <Route path='/home/servicerequest' component={ServiceRequest} />
                                    <Route path='/home/viewkeys' component={ViewKeys} />
                                    <Route path='/home/viewkeysgroup' component={ViewKeysGroup} />
                                    <Route path='/home/auditkeys' component={AuditKeys} />
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
                    </section>
            </section>
        </>
    );
};
const Dashboard = withRouter(Dash);
export default Dashboard;