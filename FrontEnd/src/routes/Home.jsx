import { useEffect, useState, useContext } from 'react';
import { Result, Form, DatePicker, InputNumber, Input, Modal, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import Api from '../helpers/core/Api';

import ContentPanel from '../components/core/layout/ContentPanel';
import Table from '../components/core/table/Table';
import MessageContext from '../helpers/core/MessageContext';

const Home = () => {
  const [loading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObject, setEditingObject] = useState('');
  const { t } = useTranslation();
  const [dataDiary, setDataDiary] = useState([]);
  const [descriptionDiary, setDescriptionDiary] = useState('');
  const [amountDiary, setAmountDiary] = useState(0);
  const { loadingMsg, savedMsg, errorMsg, destroyMsg } = useContext(MessageContext);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);

  const getData = () => {
    Api.get('/diary')
      .then(data => {
        const diaryData = [];
        data.data.forEach(element => {
          diaryData.push({
            date: dayjs(element.insertDate).format('YYYY-MM-DD'),
            key: element._id,
            ...element
          });
        });
        setDataDiary(diaryData);
      })
      .catch(err => err?.globalHandler());
  };
  useEffect(() => getData(), []);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    }
  ];

  const handleOnChangeDescription = event => {
    setDescriptionDiary(event.target.value);
  };

  const handleOnChangeAmount = event => {
    setAmountDiary(event);
  };

  const addForm = {
    title: 'Insert new Entry',
    template: (
      <Form>
        <Form.Item label="Date">
          <DatePicker id="dateDiary" />
        </Form.Item>
        <Form.Item label="Amount">
          <InputNumber onChange={handleOnChangeAmount} precision={2} />
        </Form.Item>
        <Form.Item label="Description">
          <Input onChange={handleOnChangeDescription} id="descriptionDiary" />
        </Form.Item>
      </Form>
    ),
    onSave: () => {
      const data = {
        amount: amountDiary,
        description: descriptionDiary,
        insertDate: document.getElementById('dateDiary').value,
        user: {
          email: 'test@meblabs.com'
        }
      };
      return Api.post('/diary', data).then(() => getData());
    }
  };

  const onEdit = record => {
    setIsModalLoading(false);
    setEditingObject({
      ...record,
      insertDate: dayjs(record.date, 'YYYY-MM-DD')
    });
    setIsModalOpen(true);
  };

  const handleOnChangeEditDescription = event => {
    setEditingObject({
      ...editingObject,
      description: event.target.value
    });
  };

  const handleOnChangeEditAmount = event => {
    setEditingObject({
      ...editingObject,
      amount: event
    });
    console.log(editingObject);
  };

  const handleCancel = (record, event) => {
    setIsModalOpen(false);
  };

  const handleEditModalSave = () => {
    const msg = loadingMsg();
    setIsModalLoading(true);
    setFormDisabled(true);
    console.log(editingObject);
    Api.patch('/diary', {
      ...editingObject,
      insertDate: document.getElementById('dateEditDiary').value
    })
      .then(() => {
        savedMsg(msg);
        setIsModalLoading(false);
        setFormDisabled(false);
        getData();
        if (addForm.closeAfterSave) handleCancel();
      })
      .catch(err => (err.errorFields ? destroyMsg(msg) : errorMsg(msg, err)))
      .finally(() => setIsModalLoading(false));
  };

  const onDelete = record => {
    getData();
    return Api.delete('/diary/' + record._id);
  };

  return (
    <ContentPanel title="Fullstack Test" loading={loading}>
      <Result
        icon={<FontAwesomeIcon icon={faBook} size="4x" className="text-primary" />}
        title="Expense and Income Diary"
        subTitle="Create an application to track daily expenses and incomes. Users should be able
        to add, read, update, and delete expense and income entries."
      />
      <Table
        onDelete={onDelete}
        onEdit={onEdit}
        addForm={addForm}
        deleteSaveButtonOnRow
        editCancelButtonOnRow
        dataSource={dataDiary}
        columns={columns}
      />
      <Modal
        title="Edit entry"
        open={isModalOpen}
        onOk={handleEditModalSave}
        onCancel={() => {
          addForm.onCancel?.();
          handleCancel();
        }}
        footer={[
          <Button key="submit" type="primary" loading={isModalLoading} onClick={handleEditModalSave}>
            {t('common.save')}
          </Button>
        ]}
        destroyOnClose={addForm.destroyOnClose || false}
      >
        <Form disabled={formDisabled}>
          <Form.Item label="Date">
            <DatePicker id="dateEditDiary" defaultValue={editingObject.insertDate} />
          </Form.Item>
          <Form.Item label="Amount">
            <InputNumber onChange={handleOnChangeEditAmount} precision={2} value={editingObject.amount} />
          </Form.Item>
          <Form.Item label="Description">
            <Input onChange={handleOnChangeEditDescription} value={editingObject.description} />
          </Form.Item>
        </Form>
      </Modal>
    </ContentPanel>
  );
};

export default Home;
