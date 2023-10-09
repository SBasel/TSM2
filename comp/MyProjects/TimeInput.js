import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export function TimeInput({ value, onChange, placeholder, label }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ marginRight: 10, fontSize: 18 }}>{label}</Text>
      <TextInput
        value={String(value)}
        onChangeText={(text) => {
          if (text === "") {
            onChange(""); 
          } else {
            const num = parseInt(text, 10);
            if (!isNaN(num)) {
              onChange(num);
            }
          }
        }}
        placeholder={placeholder}
        style={{ textAlign: 'center', borderWidth: 1, borderColor: '#ccc', width: 80, fontSize: 18, marginRight: 10 }}
      />
      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => onChange((value === "" ? 0 : value) + 1)}>
          <Text style={{ fontSize: 20 }}>↑</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onChange((value === "" ? 0 : value) - 1)}>
          <Text style={{ fontSize: 20, marginTop: 5 }}>↓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

