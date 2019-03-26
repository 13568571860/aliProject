import React, { Component } from 'react';
import { Form, Input, Radio, Tag, Upload, Button, Icon, Row, message } from 'antd';
import { getProductTag, submitFeedbook } from '@/services/api';
// import form from '@/locales/en-US/form';
// import styles from './Analysis.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const CreateForm = Form.create()(props => {
  const { form, label, createFeedbook, productTagList, onSubmit } = props;
  function handleClickTag(data) {
    let value = form.getFieldValue('tag');
    if (value) {
      if (value.indexOf(data.tag) >= 0) {
        value = value.replace(`${data.tag};`, '');
        return form.setFieldsValue({
          tag: value,
        });
      }
    } else {
      value = '';
    }
    value += `${data.tag};`;
    return form.setFieldsValue({
      tag: value,
    });
  }
  function onChange(file) {
    if (file.fileList[0].response) {
      // eslint-disable-next-line no-shadow
      const { imgUrl } = file.fileList[0].response.data;
      form.setFieldsValue({ imgUrl });
    }
  }
  function createProductTag(data) {
    return (
      <div className="tagBox">
        {data.map(item => {
          return (
            <Tag color="red" key={item.id} onClick={() => handleClickTag(item)}>
              {item.tag}
            </Tag>
          );
        })}
      </div>
    );
  }
  return (
    <Form
      onSubmit={e => {
        onSubmit(e, form);
      }}
    >
      <FormItem
        labelCol={{ span: 25 }}
        wrapperCol={{ span: 25 }}
        label="Please select your feedbook type:"
      >
        {form.getFieldDecorator('Feedback', {
          rules: [{ required: true, message: 'Feedback' }],
        })(createFeedbook(label))}
      </FormItem>
      <FormItem labelCol={{ span: 25 }} wrapperCol={{ span: 25 }} label="Description:">
        {form.getFieldDecorator('Description', {
          rules: [{ required: true, message: 'Description' }],
        })(<Input placeholder="Description" />)}
      </FormItem>
      <FormItem labelCol={{ span: 25 }} wrapperCol={{ span: 25 }} label="Suggestion">
        {form.getFieldDecorator('Suggestion', {
          rules: [{ required: true, message: 'Suggestion' }],
        })(<Input placeholder="Suggestion" />)}
      </FormItem>
      <FormItem labelCol={{ span: 25 }} wrapperCol={{ span: 25 }} label="Email address">
        {form.getFieldDecorator('Email', {
          rules: [
            {
              required: true,
              message: 'Email',
              pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
            },
          ],
        })(<Input placeholder="Email" />)}
      </FormItem>
      <FormItem labelCol={{ span: 25 }} wrapperCol={{ span: 25 }} label="Product tag:">
        {form.getFieldDecorator('tag', {
          rules: [{ required: true, message: 'tag', min: 1 }],
        })(<Input disabled />)}
      </FormItem>
      {createProductTag(productTagList)}
      <FormItem
        labelCol={{ span: 25 }}
        wrapperCol={{ span: 25 }}
        label="imgUrl:"
        style={{ display: 'none' }}
      >
        {form.getFieldDecorator('imgUrl', {
          rules: [{ required: true, message: 'imgUrl', min: 1 }],
        })(<Input />)}
      </FormItem>
      <Row>Attachment:</Row>
      <Upload action="/api/updateImage" onChange={onChange}>
        <Button>
          <Icon type="upload" /> Click to Upload
        </Button>
      </Upload>
      <Row>
        The system supports uploading files in JPG/PNG/BMP/GIF/PDF/DOCX/XLSX/DOC/XLS format and
        within 5MB
      </Row>
      <Row style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Row>
    </Form>
  );
});

@Form.create()
class Feedback extends Component {
  state = {
    label: [
      {
        id: 1,
        label: 'Function Suggestion',
        value: 'Function Suggestion',
      },
      {
        id: 1,
        label: 'Product Defect',
        value: 'Product Defect',
      },
      {
        id: 1,
        label: 'Product Requirement',
        value: 'Product Requirement',
      },
    ],
    productTagList: [],
  };

  componentDidMount = () => {
    getProductTag().then(res => {
      this.setState({
        productTagList: res.data.list,
      });
    });
  };

  createFeedbook = data => {
    return <RadioGroup options={data} />;
  };

  onSubmit = (e, form) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        const { imgUrl } = this.state;
        const formValue = JSON.parse(JSON.stringify(values));
        formValue.imgUrl = imgUrl;
        submitFeedbook({
          ...formValue,
        }).then(res => {
          if (res.msg === 'ok') {
            message.success('Feedbook Submitted successfullys');
          }
        });
      }
    });
  };

  render() {
    const { label, productTagList } = this.state;
    const { createFeedbook, createProductTag, onSubmit } = this;
    return (
      <div>
        <CreateForm
          label={label}
          createFeedbook={createFeedbook}
          productTagList={productTagList}
          createProductTag={createProductTag}
          onSubmit={onSubmit}
        />
      </div>
    );
  }
}

export default Feedback;
