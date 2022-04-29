import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/core';


function Home() {
    const db = SQLite.openDatabase('mainDb');
    const [userDetails, setUserDetails] = useState({ firstname: '', lastname: '' });
    const [allData, setAllData]: any = useState([]);
    const navigation:any=useNavigation();

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                "create table if not exists user (id integer primary key AUTOINCREMENT, firstname text, lastname text);"
            );
        });
    }, []);

    const addData = async () => {
        debugger
        console.log("add data called");
        await db.transaction(async (tx) => {
            await tx.executeSql("INSERT INTO user (firstname,lastname) VALUES (?,?)", [userDetails.firstname, userDetails.lastname])
        });
        setUserDetails({ firstname: '', lastname: '' });
        getData();

    };

    const getData = async () => {
        debugger
        console.log("get data called");

        await db.transaction(async (tx) => {
            await tx.executeSql("SELECT firstname,lastname,id FROM user", [], (tx, result) => {
                console.log("result", result?.rows._array);
                const len = result?.rows?.length;
                setAllData([...result?.rows._array]);
            })
        })
    };

    const deleteUser = async (id: number) => {
        debugger
        console.log("delete data called");

        await db.transaction(async (tx) => {
            await tx.executeSql("delete from user where id= ?", [id], (tx, result) => {
                console.log("delete result", result)
                if (result.rowsAffected === 1) {
                    getData();
                }
            })
        })
    };

    const updateUser = () => {
      navigation.navigate('/')
    };

    return (
        <View style={{ margin: 20 }}>
            {
                console.log("all data", allData)
            }
            <TextInput
                placeholder="firstname"
                value={userDetails.firstname}
                style={{ backgroundColor: 'white', borderWidth: 1, height: 50, marginBottom: 20 }}
                onChangeText={(text) => setUserDetails({ ...userDetails, firstname: text })}
            />
            <TextInput
                placeholder="lastname"
                value={userDetails.lastname}
                style={{ backgroundColor: 'white', borderWidth: 1, height: 50, marginBottom: 20 }}
                onChangeText={(text) => setUserDetails({ ...userDetails, lastname: text })}
            />
            <View style={{ marginBottom: 15 }}>
                <Button title="Add data" onPress={() => addData()} />
            </View>
            {/* <View>
                <Button title="Get data" onPress={() => getData()} />
            </View> */}

            {
                allData && allData.map((item: any, index: number) => {
                    return (
                        <View style={{ paddingBottom: 10, borderWidth: 1, borderBottomColor: 'black', marginTop: 15 }} key={index}>
                            <Text>{item.firstname}</Text>
                            <Text>{item.lastname}</Text>
                            <Button title="delete" onPress={() => deleteUser(item.id)} />
                            <Button title="update data" onPress={() => deleteUser(item.id)} />
                        </View>
                    )
                })
            }

        </View>);
}

export default Home;
