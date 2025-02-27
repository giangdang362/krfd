import { BANNER_TYPE } from '@/constants/bannerType';
import ButtonForm from '@/pages/components/ButtonForm/ButtonForm';
import TitleCurrentPage from '@/pages/components/TitleCurrentPage';
import { getListBannerMainPage, putBannerMainPage } from '@/services/management/main-page';
import { postImage } from '@/services/media';
import { getUrlImage } from '@/utils/media';
import { formItemRule } from '@/utils/ruleForm';
import { ProFormText, ProFormUploadButton } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Form, UploadFile, message } from 'antd';
import { useEffect, useState } from 'react';

const Banner = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [reload, setReload] = useState<boolean>(false);
  const [listBanner, setListBanner] = useState<API.BannerItem[]>([]);

  const [banner1, setBanner1] = useState<FormData | undefined>();
  const [banner2, setBanner2] = useState<FormData | undefined>();
  const [banner3, setBanner3] = useState<FormData | undefined>();

  const [curBannerFile1, setCurBannerFile1] = useState<UploadFile<any>[]>([]);
  const [curBannerFile2, setCurBannerFile2] = useState<UploadFile<any>[]>([]);
  const [curBannerFile3, setCurBannerFile3] = useState<UploadFile<any>[]>([]);

  const handleBanner1Change = async (file: File | undefined) => {
    const formDataBanner = new FormData();

    if (file) {
      formDataBanner.append('file', file);
      setBanner1(formDataBanner);
    }
  };

  const handleBanner2Change = async (file: File | undefined) => {
    const formDataBanner = new FormData();

    if (file) {
      formDataBanner.append('file', file);
      setBanner2(formDataBanner);
    }
  };
  const handleBanner3Change = async (file: File | undefined) => {
    const formDataBanner = new FormData();

    if (file) {
      formDataBanner.append('file', file);
      setBanner3(formDataBanner);
    }
  };

  const handleSave = async (formItem: API.FormTypeBanner) => {
    let listBannerResult: API.BannerItem[] = listBanner;

    let nameBanner1: string | undefined;
    let nameBanner2: string | undefined;
    let nameBanner3: string | undefined;

    if (banner1) {
      nameBanner1 = await postImage(banner1);
    }
    if (banner2) {
      nameBanner2 = await postImage(banner2);
    } else {
      nameBanner2 = '';
    }
    if (banner3) {
      nameBanner3 = await postImage(banner3);
    } else {
      nameBanner3 = '';
    }

    listBannerResult.forEach((item) => {
      if (nameBanner1 && item.id === listBanner[0].id) {
        item.fileBanner = nameBanner1;
      }
      if (item.id === listBanner[1].id) {
        item.fileBanner = nameBanner2;
      }
      if (item.id === listBanner[2].id) {
        item.fileBanner = nameBanner3;
      }

      if (item.id === listBanner[0].id) {
        item.bannerUrl = formItem.bannerUrl1;
      }
      if (item.id === listBanner[1].id) {
        item.bannerUrl = formItem.bannerUrl2;
      }
      if (item.id === listBanner[2].id) {
        item.bannerUrl = formItem.bannerUrl3;
      }
    });

    const payload: API.BannerPayload = {
      bannerMainPages: listBannerResult,
    };

    await putBannerMainPage(payload).then(() => {
      message.success(
        `${intl.formatMessage({
          id: 'pages.updateSuccess',
          defaultMessage: 'Update successfully!',
        })}`,
      );
    });
    setReload(!reload);
  };

  const handleGetListBanner = async () => {
    const res = await getListBannerMainPage({ bannerType: BANNER_TYPE.BANNER });
    if (res) {
      setListBanner(res);
    }
    setReload(true);
  };

  useEffect(() => {
    if (listBanner) {
      form.setFieldValue('bannerUrl1', listBanner[0]?.bannerUrl);
      form.setFieldValue('bannerUrl2', listBanner[1]?.bannerUrl);
      form.setFieldValue('bannerUrl3', listBanner[2]?.bannerUrl);
    }
    handleGetListBanner();

    if (listBanner[0]?.fileBanner) {
      form.setFieldValue('banner1', listBanner[0]?.fileBanner);
    }
    if (listBanner[0]) {
      setCurBannerFile1([
        {
          uid: '-1',
          name: listBanner[0]?.fileBanner || '',
          status: 'done',
          url: getUrlImage(listBanner[0]?.fileBanner ?? ''),
        },
      ]);
    }
    if (listBanner[1] && listBanner[1]?.fileBanner !== '') {
      setCurBannerFile2([
        {
          uid: '-1',
          name: listBanner[1]?.fileBanner || '',
          status: 'done',
          url: getUrlImage(listBanner[1]?.fileBanner ?? ''),
        },
      ]);
    }
    if (listBanner[2] && listBanner[2]?.fileBanner !== '') {
      setCurBannerFile3([
        {
          uid: '-1',
          name: listBanner[2]?.fileBanner || '',
          status: 'done',
          url: getUrlImage(listBanner[2]?.fileBanner ?? ''),
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
                id: 'pages.mainPage.banner.title',
                defaultMessage: 'Banner',
              })}
            </p>
            <ButtonForm
              onCancel={() => {
                setReload(!reload);
                form.resetFields();
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
            gap: '10px',
          }}
        >
          <div style={{ width: '50%', maxWidth: '392px' }}>
            <ProFormUploadButton
              label={`${intl.formatMessage({
                id: 'pages.mainPage.baner.banner1',
                defaultMessage: 'Banner 1',
              })}`}
              title={`${intl.formatMessage({
                id: 'pages.button.upload',
                defaultMessage: 'Upload',
              })}`}
              max={1}
              fieldProps={{
                onRemove: () => setCurBannerFile1([]),
              }}
              fileList={curBannerFile1}
              onChange={(e) => {
                if (e.fileList.length > 0) {
                  handleBanner1Change(e.fileList[0].originFileObj);
                  setCurBannerFile1(e.fileList);
                }
              }}
              name={'banner1'}
              rules={[formItemRule.required()]}
            />
          </div>
          <div style={{ width: '50%', maxWidth: '392px' }}>
            <ProFormText
              placeholder={''}
              name={'bannerUrl1'}
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
                id: 'pages.mainPage.baner.banner2',
                defaultMessage: 'Banner 2',
              })}`}
              max={1}
              fieldProps={{
                onRemove: () => {
                  setBanner2(undefined);
                  setCurBannerFile2([]);
                },
              }}
              fileList={curBannerFile2}
              onChange={(e) => {
                if (e.fileList.length > 0) {
                  handleBanner2Change(e.fileList[0].originFileObj);
                  setCurBannerFile2(e.fileList);
                }
              }}
            />
          </div>
          <div style={{ width: '50%', maxWidth: '392px' }}>
            <ProFormText
              placeholder={''}
              name="bannerUrl2"
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
                id: 'pages.mainPage.baner.banner3',
                defaultMessage: 'Banner 3',
              })}`}
              max={1}
              fieldProps={{
                onRemove: () => {
                  setBanner3(undefined);
                  setCurBannerFile3([]);
                },
              }}
              fileList={curBannerFile3}
              onChange={(e) => {
                if (e.fileList.length > 0) {
                  handleBanner3Change(e.fileList[0].originFileObj);
                  setCurBannerFile3(e.fileList);
                }
              }}
            />
          </div>
          <div style={{ width: '50%', maxWidth: '392px' }}>
            <ProFormText
              placeholder={''}
              name="bannerUrl3"
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

export default Banner;
