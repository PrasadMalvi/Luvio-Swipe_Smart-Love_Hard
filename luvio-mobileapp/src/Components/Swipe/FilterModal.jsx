import React, { useState } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Slider from "@react-native-community/slider";

const FilterModal = ({ visible, onClose, onApply }) => {
    const [gender, setGender] = useState("Everyone");
    const [ageRange, setAgeRange] = useState([18, 50]);
    const [distance, setDistance] = useState(50);
    const [lookingFor, setLookingFor] = useState([]);
    const [relationshipPreference, setRelationshipPreference] = useState([]);

    const lookingForOptions = ["Long-term", "Short-term", "New Friends", "Figuring Out"];
    const relationshipOptions = ["Monogamy", "Polygamy", "Open to Explore", "Ethical Non-Monogamy"];

    const handleAgeRangeChange = (values) => {
        setAgeRange(values);
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
                <View
                    style={{
                        backgroundColor: "#28282B",
                        margin: 0,
                        borderRadius: 10,
                        padding: 15,
                    }}
                >
                    <TouchableOpacity onPress={onClose} style={{ alignSelf: "flex-end" }}>
                        <Ionicons name="close" size={28} color="white" />
                    </TouchableOpacity>

                    <ScrollView>
                        {/* Gender Preference */}
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: 'white', marginBottom: 10 }}>
                        Who Catches Your Eye?
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {["Men", "Women", "Everyone"].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    onPress={() => setGender(option)}
                                    style={{
                                        padding: 10,
                                        backgroundColor: gender === option ? "#b25776" : "#ddd",
                                        margin: 5,
                                        borderRadius: 8,
                                    }}
                                >
                                    <Text style={{ color: gender === option ? "#fff" : "#000" }}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Age Range Slider */}
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: 'white', marginTop: 20 }}>
                            Age Between: {ageRange[0]} to {ageRange[1]}
                        </Text>
                        <MultiSlider
                            values={[ageRange[0], ageRange[1]]}
                            sliderLength={300}
                            onValuesChange={handleAgeRangeChange}
                            min={18}
                            max={100}
                            step={1}
                            allowOverlap={false}
                            snapped
                            selectedStyle={{
                                backgroundColor: '#b25776',
                            }}
                            unselectedStyle={{
                                backgroundColor: 'grey',
                                marginLeft: 2
                            }}
                            containerStyle={{
                                height: 40,
                            }}
                            trackStyle={{
                                height: 5,
                                borderRadius: 5,
                            }}
                            markerStyle={{
                                height: 15,
                                width: 15,
                                borderRadius: 15,
                                backgroundColor: '#b25776',
                                borderWidth: 0.4,
                                borderColor: 'grey',
                                marginLeft: 15,
                                marginTop:3
                            }}
                            pressedMarkerStyle={{
                                height: 15,
                                width: 15,
                                borderRadius: 18,
                                marginLeft: 5
                            }}
                        />

                        {/* Distance Range */}
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: 'white', marginTop: 20 }}>
                            Up to '{distance}' kilometers away
                        </Text>
                        <Slider
                            minimumValue={1}
                            maximumValue={100}
                            step={1}
                            value={distance}
                            onValueChange={(value) => setDistance(value)}
                            minimumTrackTintColor="#b25776"
                            maximumTrackTintColor="grey"
                            thumbTintColor="#b25776"
                            style={{ height: 40,marginLeft:-15 }}
                            thumbStyle={{ height: 15, width: 15, borderRadius: 15, borderWidth: 0.4, borderColor: 'grey'}}
                            
                        />

                        {/* Looking For (Selectable Options) */}
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: 'white', marginTop: 20 }}>
                            Looking For
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {lookingForOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    onPress={() => {
                                        if (lookingFor.includes(option)) {
                                            setLookingFor(lookingFor.filter(item => item !== option));
                                        } else {
                                            setLookingFor([...lookingFor, option]);
                                        }
                                    }}
                                    style={{
                                        padding: 10,
                                        backgroundColor: lookingFor.includes(option) ? "#b25776" : "#ddd",
                                        margin: 5,
                                        borderRadius: 8,
                                    }}
                                >
                                    <Text style={{ color: lookingFor.includes(option) ? "#fff" : "#000" }}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Relationship Preference (Selectable Options) */}
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: 'white', marginTop: 20 }}>
                            Relationship Preference
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {relationshipOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    onPress={() => {
                                        if (relationshipPreference.includes(option)) {
                                            setRelationshipPreference(relationshipPreference.filter(item => item !== option));
                                        } else {
                                            setRelationshipPreference([...relationshipPreference, option]);
                                        }
                                    }}
                                    style={{
                                        padding: 10,
                                        backgroundColor: relationshipPreference.includes(option) ? "#b25776" : "#ddd",
                                        margin: 5,
                                        borderRadius: 8,
                                    }}
                                >
                                    <Text style={{ color: relationshipPreference.includes(option) ? "#fff" : "#000" }}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Apply Button */}
                        <TouchableOpacity
                            onPress={() => {
                                onApply({
                                    gender,
                                    ageRange,
                                    distance,
                                    lookingFor,
                                    relationshipPreference,
                                });
                                onClose();
                            }}
                            style={{
                                backgroundColor: "#b25776",
                                padding: 12,
                                marginTop: 20,
                                borderRadius: 10,
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "white", fontSize: 16 }}>Apply Filters</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default FilterModal;