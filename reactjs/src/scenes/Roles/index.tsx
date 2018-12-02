import { Card, Col, Row, Button, Table, Dropdown, Menu } from 'antd';
import 'antd/dist/antd.css';
import * as React from 'react';
import { EntityDto } from 'src/services/dto/entityDto';
import CreateOrUpdateRules from './components/createOrUpdateRoles';
import { observer, inject } from 'mobx-react';
import AppComponentBase from 'src/components/AppComponentBase';
import Stores from 'src/stores/storeIdentifier';
import RoleStore from 'src/stores/roleStore';
import { L } from 'src/lib/abpUtility';

export interface IRoleProps {
  roleStore: RoleStore;
}

export interface IRoleState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
}

@inject(Stores.RoleStore)
@observer
class Role extends AppComponentBase<any> {
  formRef: any;
  constructor(props: any) {
    super(props);
  }

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    roleId: 0
  };

  async componentWillMount() {
    await this.getAll();
  }

  async getAll() {
    debugger;
    await this.props.roleStore.getAll({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount });
  }

  handleTableChange = (pagination: any) => {
    this.setState({ skipCount: (pagination.current - 1) * this.state.maxResultCount! }, async () => await this.getAll());
  };

  Modal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  async createOrUpdateModalOpen(entityDto: EntityDto) {
  

    if (entityDto.id == 0) {
      await this.props.roleStore.createRole();
      await this.props.roleStore.getAllPermissions();
    }
    else {
      await this.props.roleStore.getRoleForEdit(entityDto);
      await this.props.roleStore.getAllPermissions();
    }

    this.setState({ roleId: entityDto.id })
    this.Modal();

    debugger;
    this.formRef.props.form.setFieldsValue({
      ...this.props.roleStore.roleForEdit.role,
      permissions: this.props.roleStore.roleForEdit.grantedPermissionNames,
    });
  }

  delete(input: EntityDto) {
    this.props.roleStore.delete(input);
  }
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields(async (err: any, values: any) => {
      debugger;
      if (err) {
        return;
      }
      else {
        if (this.state.roleId == 0) {
          await this.props.roleStore.create(values);
        }
        else {
          await this.props.roleStore.update({ id: this.state.roleId, ...values });
        }
      }
      await this.getAll();
      this.setState({ modalVisible: false });
      form.resetFields();
    });
  }

  saveFormRef = (formRef: any) => {
    this.formRef = formRef;
  }
  public render() {
    const { allPermissions,roles} = this.props.roleStore;
    const columns = [{ title: L('RoleName'), dataIndex: 'name', key: 'name', width: 150, render: (text: string) => <div>
            {text}
          </div> }, { title: L('DisplayName'), dataIndex: 'displayName', key: 'displayName', width: 150, render: (text: string) => <div>
            {text}
      </div>
      }, {
        title:  L('Actions'), width: 150, render: (text: string, item: any) => <div>
            <Dropdown trigger={['click']} overlay={<Menu>
                  <Menu.Item>
                    <a onClick={() => this.createOrUpdateModalOpen({ id: item.id })}>{L('Edit')}</a>
                  </Menu.Item>
                  <Menu.Item>
                    <a onClick={() => this.delete({ id: item.id })}>{L('Delete')}</a>
                  </Menu.Item>
                </Menu>} placement="bottomLeft">
              <Button type="primary" icon="setting">
                {L('Actions')}
              </Button>
            </Dropdown>
          </div> }];
    return <Card>
        <Row>
          <Col xs={{ span: 4, offset: 0 }} sm={{ span: 4, offset: 0 }} md={{ span: 4, offset: 0 }} lg={{ span: 2, offset: 0 }} xl={{ span: 2, offset: 0 }} xxl={{ span: 2, offset: 0 }}>
            <h2>{L('Roles')}</h2>
          </Col>
          <Col xs={{ span: 14, offset: 0 }} sm={{ span: 15, offset: 0 }} md={{ span: 15, offset: 0 }} lg={{ span: 1, offset: 21 }} xl={{ span: 1, offset: 21 }} xxl={{ span: 1, offset: 21 }}>
            <Button type="primary" shape="circle" icon="plus" onClick={() => this.createOrUpdateModalOpen({ id: 0 })} />
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 24, offset: 0 }} lg={{ span: 24, offset: 0 }} xl={{ span: 24, offset: 0 }} xxl={{ span: 24, offset: 0 }}>
            <Table size={'default'} bordered={true} pagination={{ pageSize: this.state.maxResultCount, total: roles == undefined ? 0 : roles.totalCount, defaultCurrent: 1 }} columns={columns} loading={roles == undefined ? true : false} dataSource={roles == undefined ? [] : roles.items} onChange={this.handleTableChange} />
          </Col>
        </Row>

        <CreateOrUpdateRules wrappedComponentRef={this.saveFormRef} visible={this.state.modalVisible} onCancel={() => this.setState({
              modalVisible: false,
            })} modalType={this.state.roleId == 0 ? 'edit' : 'create'} onOk={this.handleCreate} permission={allPermissions} />
      </Card>;
  }
}

export default Role;
