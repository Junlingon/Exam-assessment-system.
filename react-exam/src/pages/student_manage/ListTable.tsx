
import React, { useEffect, } from 'react';
import { Table, Divider, Form } from 'antd';
import { useAppDispatch } from '@/store'
import { get_student_async, set_current_edit_userinfo, set_is_show_user_edit_modal, select_user_student_list_data, select_student_list_search_params, select_student_list_current_page, set_student_list_current_page } from '../../store/slice/user';
import { get_subject_tree_async } from '@/store/slice/subject';
import { userDelete } from '@/util/request';
import dayjs from 'dayjs'
import { useAppSelector } from '../../store/index';
import { Pagination } from 'antd';
import styles from './index.module.css'

const PAGE_COUNT = 10

const ListTable: React.FC = () => {
    const dispatch = useAppDispatch();
    // const student_list = useSelector(select_user_student_list)

    const data = useAppSelector(select_user_student_list_data)
    const search_params = useAppSelector(select_student_list_search_params)
    const student_list = data.list
    const count = data.count
    const current_page = useAppSelector(select_student_list_current_page)

    useEffect(() => {
        dispatch(get_subject_tree_async())


        dispatch(get_student_async({}))
    }, [])

    async function edit_click(record: any) {
        dispatch(set_current_edit_userinfo(record))
        dispatch(set_is_show_user_edit_modal(true))
    }

    async function delete_click(record: any) {
        await userDelete(record._id)
        dispatch(get_student_async({
            ...search_params,
            skip: (current_page - 1) * PAGE_COUNT,
            limit: PAGE_COUNT
        }))
    }

    function page_change(val: any) {
        // console.log(val)
        dispatch(set_student_list_current_page(val))

        dispatch(get_student_async({
            ...search_params,
            skip: (val - 1) * PAGE_COUNT,
            limit: PAGE_COUNT
        }))
    }

    const columns = [
        {
            title: '花名',
            dataIndex: 'name',
            key: 'name',
            render: (dom: any, entity: any) => {
                return (
                    <a
                        onClick={() => {
                        }}
                    >
                        {dom}
                    </a>
                );
            },
        },
        {
            title: '所属课程',
            dataIndex: 'sourceId',
            key: 'sourceId',
        },
        {
            title: '当前薪资',
            dataIndex: 'sourceSalary',
            key: 'sourceSalary',
        },
        {
            title: '技术栈',
            dataIndex: 'technologyStack',
            key: 'technologyStack',
        },
        {
            title: '学历',
            dataIndex: 'educationBackground',
            key: 'educationBackground',
        },
        {
            title: '号码',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '课程权限',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: '注册时间',
            dataIndex: 'created',
            key: 'created',
            render: (_: any, record: any) => {
                // console.log(_, record)
                return <span>{dayjs(record.created).format('YYYY MM-DD')}</span>
            }
        },
        {
            title: '操作',
            width: 380,
            dataIndex: 'option',
            render: (_: any, record: any) => [
                <a key="jurisdictionEdit" onClick={() => {
                    edit_click(record)
                }}>
                    编辑
                </a>,
                <Divider type="vertical" />,
                <a key="delete"
                    onClick={() => {
                        delete_click(record)
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];

    return (
        <>
            <Table
                dataSource={student_list}
                columns={columns}
                pagination={false}
            />
            <Pagination
                className={styles.pagenation}
                pageSize={PAGE_COUNT}
                current={current_page}
                total={count}
                onChange={page_change}
            />
        </>
    );
};

export default ListTable;
