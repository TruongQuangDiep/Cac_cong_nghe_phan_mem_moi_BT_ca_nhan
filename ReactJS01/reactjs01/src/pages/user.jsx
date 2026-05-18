import { notification, Table } from "antd";
import { useEffect, useState } from "react";
import { getUserApi } from "../util/api";

const UserPage = () => {

    const [dataSource, setDataSource] =
        useState([]);

    useEffect(() => {

        const fetchUser = async () => {

            const res =
                await getUserApi();

            if (!res?.message) {

                setDataSource(res);

            } else {

                notification.error({
                    message: "Unauthorized",
                    description: res.message
                });
            }
        };

        fetchUser();

    }, []);

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
    ];

    return (

        <div className="p-6">

            <h1
                className="mb-5 text-2xl font-bold"
            >
                User list
            </h1>

            <Table
                bordered
                dataSource={dataSource}
                columns={columns}
                rowKey={"_id"}
            />

        </div>
    );
};

export default UserPage;