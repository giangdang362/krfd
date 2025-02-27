import ButtonForm from '@/pages/components/ButtonForm/ButtonForm';
import TitleCurrentPage from '@/pages/components/TitleCurrentPage';
import {
  getFandomServiceMainPage,
  putFandomServiceMainPage,
} from '@/services/management/main-page';
import { postImage } from '@/services/media';
import { getUrlImage } from '@/utils/media';
import { formItemRule } from '@/utils/ruleForm';
import { ProFormText, ProFormUploadButton } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Form, UploadFile, message } from 'antd';
import { useEffect, useState } from 'react';

const FandomService = () => {
  const intl = useIntl();
  const [form] = Form.useForm<API.FandomServiceItem>();

  const [reload, setReload] = useState<boolean>(false);
  const [fandomService, setFandomService] = useState<API.FandomServiceItem>();

  const [banner, setBanner] = useState<FormData | undefined>();
  const [curBanner, setCurBanner] = useState<UploadFile<any>[]>([]);
  const handleBannerChange = async (file: File | undefined) => {
    const formDataBanner = new FormData();
    if (file) {
      formDataBanner.append('file', file);
      setBanner(formDataBanner);
    } else {
      setBanner(undefined);
    }
  };

  const handleSubmitFandom = async (formItem: API.FandomServiceItem) => {
    let nameBanner;
    if (banner) {
      nameBanner = await postImage(banner);
    }
    const payload: API.FandomServiceItem = {
      id: formItem.id,
      fandomServiceBannerUrl: formItem.fandomServiceBannerUrl,
      fandomServiceFileBanner: nameBanner || fandomService?.fandomServiceFileBanner,
    };

    await putFandomServiceMainPage(payload).then(() =>
      message.success(
        `${intl.formatMessage({
          id: 'pages.updateSuccess',
          defaultMessage: 'Update successfully!',
        })}`,
      ),
    );
    setReload(!reload);
  };

  const handleGetFandom = async () => {
    const res = await getFandomServiceMainPage();
    if (res) {
      setFandomService(res);
    }
    setReload(true);
  };

  useEffect(() => {
    if (fandomService) {
      form.setFieldValue('id', fandomService?.id);
      form.setFieldValue('fandomServiceBannerUrl', fandomService?.fandomServiceBannerUrl);
      form.setFieldValue('fandomServiceFileBanner', fandomService?.fandomServiceFileBanner);
    }
    handleGetFandom();
    setCurBanner([
      {
        uid: '-1',
        name: fandomService?.fandomServiceFileBanner || '',
        status: 'done',
        url: getUrlImage(fandomService?.fandomServiceFileBanner ?? ''),
      },
    ]);
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
                id: 'pages.mainPage.fandomService.title',
                defaultMessage: 'Fandom service',
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
        onFinish={handleSubmitFandom}
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
                id: 'pages.mainPage.baner.title',
                defaultMessage: 'Banner',
              })}`}
              name="fandomServiceFileBanner"
              max={1}
              fieldProps={{
                onRemove: () => setCurBanner([]),
              }}
              fileList={curBanner}
              onChange={(e) => {
                if (e.fileList.length > 0) {
                  handleBannerChange(e.fileList[0].originFileObj);
                  setCurBanner(e.fileList);
                }
              }}
              rules={[formItemRule.required()]}
            />
          </div>
          <div style={{ width: '50%', maxWidth: '392px' }}>
            <ProFormText
              placeholder={''}
              name={'fandomServiceBannerUrl'}
              label={`${intl.formatMessage({
                id: 'pages.mainPage.baner.linkURL',
                defaultMessage: 'Link URL',
              })}`}
              rules={[formItemRule.required()]}
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default FandomService;
