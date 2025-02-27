import { BANNER_TYPE } from '@/constants/bannerType';
import ButtonForm from '@/pages/components/ButtonForm/ButtonForm';
import TitleCurrentPage from '@/pages/components/TitleCurrentPage';
import { getListBannerMainPage, putBannerMainPage } from '@/services/management/main-page';
import { postImage } from '@/services/media';
import { getUrlImage } from '@/utils/media';
import { ProFormText, ProFormUploadButton } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Form, UploadFile, message } from 'antd';
import { useEffect, useState } from 'react';

const PopupAds = () => {
  const intl = useIntl();
  const [reload, setReload] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [listPopup, setListPopup] = useState<API.BannerItem[]>([]);

  const [popup1, setPopup1] = useState<FormData | undefined>();
  const [popup2, setPopup2] = useState<FormData | undefined>();
  const [curPopup1, setCurPopup1] = useState<UploadFile<any>[]>([]);
  const [curPopup2, setCurPopup2] = useState<UploadFile<any>[]>([]);

  const handlePopup1Change = async (file: File | undefined) => {
    const formDataPopup = new FormData();

    if (file) {
      formDataPopup.append('file', file);
      setPopup1(formDataPopup);
    }
  };

  const handlePopup2Change = async (file: File | undefined) => {
    const formDataPopup = new FormData();

    if (file) {
      formDataPopup.append('file', file);
      setPopup2(formDataPopup);
    }
  };

  const handleSave = async (formItem: API.FormTypePopupApp) => {
    let listPopupResult: API.BannerItem[] = listPopup;

    let namePopup1: string | undefined;
    let namePopup2: string | undefined;

    if (popup1) {
      namePopup1 = await postImage(popup1);
    } else {
      namePopup1 = '';
    }
    if (popup2) {
      namePopup2 = await postImage(popup2);
    } else {
      namePopup2 = '';
    }

    listPopupResult.forEach((item) => {
      if (item.id === listPopup[0].id) {
        item.fileBanner = namePopup1;
      }
      if (item.id === listPopup[1].id) {
        item.fileBanner = namePopup2;
      }

      if (item.id === listPopup[0].id) {
        item.bannerUrl = formItem.popup1;
      }
      if (item.id === listPopup[1].id) {
        item.bannerUrl = formItem.popup2;
      }
    });

    const payload: API.BannerPayload = {
      bannerMainPages: listPopupResult,
    };

    await putBannerMainPage(payload).then(() =>
      message.success(
        `${intl.formatMessage({
          id: 'pages.updateSuccess',
          defaultMessage: 'Update successfully!',
        })}`,
      ),
    );
    setReload(!reload);
  };

  const handleGetListBanner = async () => {
    const res = await getListBannerMainPage({ bannerType: BANNER_TYPE.POPUP });
    if (res) {
      setListPopup(res);
    }
    setReload(true);
  };

  useEffect(() => {
    if (listPopup) {
      form.setFieldValue('popup1', listPopup[0]?.bannerUrl);
      form.setFieldValue('popup2', listPopup[1]?.bannerUrl);
    }
    handleGetListBanner();
    if (listPopup[0] && listPopup[0]?.fileBanner !== '') {
      setCurPopup1([
        {
          uid: '-1',
          name: listPopup[0]?.fileBanner || '',
          status: 'done',
          url: getUrlImage(listPopup[0]?.fileBanner ?? ''),
        },
      ]);
    }
    if (listPopup[1] && listPopup[1]?.fileBanner !== '') {
      setCurPopup2([
        {
          uid: '-1',
          name: listPopup[1]?.fileBanner || '',
          status: 'done',
          url: getUrlImage(listPopup[1]?.fileBanner ?? ''),
        },
      ]);
    }
  }, [reload]);
  return (
    <div
      style={{
        maxWidth: '800px',
      }}
    >
      <TitleCurrentPage
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ color: '#C8467C', fontWeight: '600', marginBottom: '0px' }}>
              {intl.formatMessage({
                id: 'pages.mainPage.popupAds.title',
                defaultMessage: 'Popup Ads',
              })}
            </p>
            <ButtonForm
              onCancel={() => {
                setReload(!reload);
              }}
              onSubmit={() => form.submit()}
            />
          </div>
        }
      />
      <Form
        style={{ marginTop: '16px' }}
        form={form}
        layout="vertical"
        name="roleForm"
        onFinish={handleSave}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            maxWidth: '800px',
            gap: '10px',
          }}
        >
          <div style={{ width: '50%', maxWidth: '392px' }}>
            <ProFormUploadButton
              title={`${intl.formatMessage({
                id: 'pages.button.upload',
                defaultMessage: 'Upload',
              })}`}
              label={`${intl.formatMessage({
                id: 'pages.mainPage.baner.popup1',
                defaultMessage: 'PopupApp 1',
              })}`}
              name="bannerUpload1"
              max={1}
              fieldProps={{
                onRemove: () => {
                  setPopup1(undefined);
                  setCurPopup1([]);
                },
              }}
              fileList={curPopup1}
              onChange={(e) => {
                if (e.fileList.length > 0) {
                  handlePopup1Change(e.fileList[0].originFileObj);
                  setCurPopup1(e.fileList);
                }
              }}
            />
          </div>
          <div style={{ width: '50%', maxWidth: '392px' }}>
            <ProFormText
              placeholder={''}
              name={'popup1'}
              label={`${intl.formatMessage({
                id: 'pages.mainPage.baner.linkURL',
                defaultMessage: 'Link URL',
              })}`}
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            maxWidth: '800px',
            gap: '10px',
          }}
        >
          <div style={{ width: '50%', maxWidth: '392px' }}>
            <ProFormUploadButton
              title={`${intl.formatMessage({
                id: 'pages.button.upload',
                defaultMessage: 'Upload',
              })}`}
              label={`${intl.formatMessage({
                id: 'pages.mainPage.baner.popup2',
                defaultMessage: 'PopupApp 2',
              })}`}
              name="bannerUpload2"
              max={1}
              fieldProps={{
                onRemove: () => {
                  setPopup2(undefined);
                  setCurPopup2([]);
                },
              }}
              fileList={curPopup2}
              onChange={(e) => {
                if (e.fileList.length > 0) {
                  handlePopup2Change(e.fileList[0].originFileObj);
                  setCurPopup2(e.fileList);
                }
              }}
            />
          </div>
          <div style={{ width: '50%', maxWidth: '392px' }}>
            <ProFormText
              placeholder={''}
              name="popup2"
              label={`${intl.formatMessage({
                id: 'pages.mainPage.baner.linkURL',
                defaultMessage: 'Link URL',
              })}`}
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default PopupAds;
