import { useState, useReducer, createContext, useContext, ReactNode } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList } from "react-native";

// Define User type
type User = {
    id: number;
    name: string;
    phone: string;
    address: string;
};


type State = {
    users: User[];
};


type Action =
    | { type: "ADD_USER"; payload: Omit<User, "id"> }
    | { type: "UPDATE_USER"; payload: User }
    | { type: "DELETE_USER"; payload: number };


const initialState: State = { users: [] };


const userReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "ADD_USER":
            return { users: [...state.users, { id: Date.now(), ...action.payload }] };
        case "UPDATE_USER":
            return {
                users: state.users.map(user => user.id === action.payload.id ? action.payload : user)
            };
        case "DELETE_USER":
            return { users: state.users.filter(user => user.id !== action.payload) };
        default:
            return state;
    }
};


type UserContextType = {
    state: State;
    dispatch: React.Dispatch<Action>;
};


const UserContext = createContext<UserContextType | undefined>(undefined);


const useUserContext = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};


const UserProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);
    return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
};


export default function Exercise6() {
    return (
        <UserProvider>
            <UserManagement />
        </UserProvider>
    );
}


function UserManagement() {
    const { state, dispatch } = useUserContext();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleSubmit = () => {
        if (name && phone && address) {
            if (editingUser) {
                dispatch({ type: "UPDATE_USER", payload: { id: editingUser.id, name, phone, address } });
                setEditingUser(null);
            } else {
                dispatch({ type: "ADD_USER", payload: { name, phone, address } });
            }
            setName(""); setPhone(""); setAddress("");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Management</Text>
            <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
            <TextInput placeholder="Phone" style={styles.input} value={phone} onChangeText={setPhone} />
            <TextInput placeholder="Address" style={styles.input} value={address} onChangeText={setAddress} />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>{editingUser ? "Update User" : "Add User"}</Text>
            </TouchableOpacity>

            <FlatList
                data={state.users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.userItem}>
                        <Text>{item.name} - {item.phone} - {item.address}</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.editButton} onPress={() => {
                                setEditingUser(item);
                                setName(item.name);
                                setPhone(item.phone);
                                setAddress(item.address);
                            }}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => dispatch({ type: "DELETE_USER", payload: item.id })}>
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
    input: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, marginBottom: 10 },
    button: { backgroundColor: '#3bd95a', padding: 10, borderRadius: 5, alignItems: 'center', width: '100%' },
    buttonText: { color: '#fff', fontSize: 15 },
    userItem: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    buttonContainer: { flexDirection: 'row' },
    editButton: { backgroundColor: '#28a745', padding: 5, borderRadius: 5, marginRight: 5 },
    deleteButton: { backgroundColor: '#dc3545', padding: 5, borderRadius: 5 },
});
