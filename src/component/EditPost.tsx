import React, { useState } from 'react';
import { Button, notification, Input, Modal } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePost } from '../services/mutation/post';
import { IPost } from '../interfaces/post.interface';
import { EditOutlined } from '@ant-design/icons';

interface Props {
    data: IPost;
}

const EditPost: React.FC<Props> = ({data}) => {
  const [title, setTitle] = useState<string>(data?.title || '');
  const [content, setContent] = useState<string>(data?.description ||'');
  const [visible, setVisible] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const { mutate, isPending} = useMutation({
    mutationFn: async (payload: { title: string; description: string; id: number }) => {
      return await updatePost(payload);
    },
    onSuccess: () => {
      setVisible(false);
      queryClient.refetchQueries({ queryKey: ['posts'], exact: true });
      notification.success({
        message: 'Success',
        description: 'Post has been updated successfully',
      })
    },
    onError: () => {
        notification.error({
            message: 'Post warning',
            description: 'Something went wrong',
        })
    },
  });

  const handlePostSubmit = async () => {
    if (title.trim() || content.trim()) {
      mutate({
        title,
        description: content,
        id: Number(data?.id),
      });
    }
  };

  return (
    <>
        <Button
            icon={<EditOutlined />}
            className="border-none bg-white shadow-none"
            onClick={() => setVisible(true)}
        />
      <Modal
          title="Edit Post"
          open={visible}
          onCancel={() => setVisible(false)}
          footer={null}
          destroyOnClose
          maskClosable={false}
        >

        <div className="w-full p-5">
          <div className="w-full flex flex-col gap-5">
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Input.TextArea
              value={content}
              onChange={handleChange}
              placeholder="Description"
              rows={4}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="mt-3 flex justify-end">
              <Button
                type="primary"
                onClick={handlePostSubmit}
                disabled={!content.trim() || !title.trim()|| isPending}
                loading={isPending}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
    </Modal>
    </>
  );
};

export default EditPost;
