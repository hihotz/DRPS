import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, ScrollView, TouchableWithoutFeedback, Image, StyleSheet } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const App = () => {
  const [showList, setShowList] = useState(false); // 전체보기 리스트 표시 여부
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태
  const [searchText, setSearchText] = useState('');
  const [apiData, setApiData] = useState(null); // API에서 받아온 데이터

  const [selectedDisasters, setSelectedDisasters] = useState({
    bigButton1: '태풍',
    bigButton2: '호우',
    bigButton3: '폭염',
    bigButton4: '한파',
  });

  const [activeDisasters, setActiveDisasters] = useState(['태풍', '호우', '폭염', '한파']);

  const modalDataList = [
    { id: '1', title: '침수', icon: 'home-flood', iconType: 'MaterialCommunityIcons' },
    { id: '2', title: '태풍', icon: 'weather-hurricane', iconType: 'MaterialCommunityIcons' },
    { id: '3', title: '호우', icon: 'rainy-outline', iconType: 'Ionicons' },
    { id: '4', title: '낙뢰', icon: 'thunderstorm-outline', iconType: 'Ionicons' },
    { id: '5', title: '강풍', icon: 'weather-windy', iconType: 'MaterialCommunityIcons' },
    { id: '6', title: '풍랑', icon: 'waves', iconType: 'MaterialCommunityIcons' },
    { id: '7', title: '대설', icon: 'weather-snowy-heavy', iconType: 'MaterialCommunityIcons' },
    { id: '8', title: '한파', icon: 'snow', iconType: 'Ionicons' },
    { id: '9', title: '폭염', icon: 'sunny-outline', iconType: 'Ionicons' },
    { id: '10', title: '황사', icon: 'partly-sunny-outline', iconType: 'Ionicons' },
    { id: '11', title: '지진', icon: 'house-damage', iconType: 'FontAwesome5' },
    { id: '12', title: '해일', icon: 'water', iconType: 'Ionicons' },
    { id: '13', title: '지진해일', icon: 'water', iconType: 'Ionicons' },
    { id: '14', title: '화산폭발', icon: 'flame', iconType: 'Ionicons' },
    { id: '15', title: '가뭄', icon: 'sunny', iconType: 'Ionicons' },
    { id: '16', title: '홍수', icon: 'water', iconType: 'Ionicons' },
    { id: '17', title: '조수', icon: 'waves', iconType: 'Ionicons' },
    { id: '18', title: '산사태', icon: 'terrain', iconType: 'Ionicons' },
    { id: '19', title: '자연우주물체추락', icon: 'planet', iconType: 'Ionicons' },
    { id: '20', title: '우주전파재난', icon: 'radio', iconType: 'Ionicons' },
    { id: '21', title: '조류대발생(녹조)', icon: 'leaf', iconType: 'Ionicons' },
    { id: '22', title: '적조', icon: 'leaf', iconType: 'Ionicons' },
  ];

  const allDisastersList = modalDataList.map(({ id, title }) => ({ id, title }));

  // 아이콘 컴포넌트 동적으로 가져오기
  const getIconComponent = (iconType, iconName, size = 35, color = 'black', style = {}) => {
    if (iconType === 'Ionicons') {
      return <Ionicons name={iconName} size={size} color={color} style={style} />;
    } else if (iconType === 'FontAwesome') {
      return <FontAwesome name={iconName} size={size} color={color} style={style} />;
    } else if (iconType === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={iconName} size={size} color={color} style={style} />;
    } else if (iconType === 'FontAwesome5') {
      return <FontAwesome5 name={iconName} size={size} color={color} style={style} />;
    }else {
      console.warn(`Unknown icon type: ${iconType}`); // 잘못된 아이콘 타입 경고
      return null;
    }
  };

  // API 요청 함수 (returnfile=webp, returntype=base64 기본값 설정)
  const fetchDisasterInfo = async (disaster) => {
    try {
      const response = await fetch(
        'https://apis.uiharu.dev/drps/NationalActionTips/api.php?category=naturaldisaster&id=01001&returnfile=pdf&returntype=base64'
      );
      const data = await response.json(); // base64 형식의 데이터를 받아온다고 가정
      if (data.returntype) {
        setApiData(data.returntype); // 데이터를 상태에 저장
      } else {
        console.log('API 요청 실패:', data);
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
    }
  };

  const handleItemPress = (title) => {
    if (activeDisasters.length === 4 && !activeDisasters.includes(title)) {
      return;
    }

    setSelectedDisasters((prevState) => {
      const updatedDisasters = { ...prevState };
      if (activeDisasters.includes(title)) {
        setActiveDisasters((prevList) => prevList.filter((disaster) => disaster !== title));
        const buttonKey = Object.keys(updatedDisasters).find((key) => updatedDisasters[key] === title);
        if (buttonKey) {
          updatedDisasters[buttonKey] = '';
        }
      } else {
        const buttonKey = Object.keys(updatedDisasters).find((key) => updatedDisasters[key] === '');
        if (buttonKey) {
          updatedDisasters[buttonKey] = title;
          setActiveDisasters((prevList) => [...prevList, title]);
        }
      }
      return updatedDisasters;
    });
  };

  const getIconForDisaster = (title) => {
    const disaster = modalDataList.find((item) => item.title === title);
    return disaster ? disaster.icon : 'help';
  };

  const getButtonStyle = (title) => {
    return activeDisasters.includes(title) ? { backgroundColor: '#B0E0E6' } : { backgroundColor: '#f0f0f0' };
  };

  // 선택된 재난 항목의 순번을 가져오는 함수
  const getSelectedItemIndex = (title) => {
    return activeDisasters.indexOf(title) + 1; // 인덱스는 0부터 시작하므로 +1
  };

  const renderApiData = () => {
    if (apiData) {
      const webpUri = `data:image/webp;base64,${apiData}`;
      return <Image source={{ uri: webpUri }} style={{ width: 300, height: 300, resizeMode: 'contain' }} />;
    }
    return null;
  };

  const renderHeader = () => (
    <>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="검색어를 입력하세요"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <MaterialIcons name="search" size={24} color="black" style={styles.searchIcon} />
      </View>

      <TouchableOpacity style={styles.settingsButton} onPress={() => setShowModal(true)}>
        <Ionicons name="settings-sharp" size={24} color="black" />
        <Text style={styles.settingsButtonText}>재난 설정</Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.bigButton, getButtonStyle(selectedDisasters.bigButton1)]} onPress={() => fetchDisasterInfo(selectedDisasters.bigButton1)}>
          {getIconComponent(
            modalDataList.find(item => item.title === selectedDisasters.bigButton1)?.iconType || 'Ionicons',
            modalDataList.find(item => item.title === selectedDisasters.bigButton1)?.icon || 'help',
            65, // 아이콘 크기
            'black', // 아이콘 색상
            styles.buttonIcon // 아이콘 스타일
          )}
          <Text style={styles.buttonText}>{selectedDisasters.bigButton1}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bigButton, getButtonStyle(selectedDisasters.bigButton2)]} onPress={() => fetchDisasterInfo(selectedDisasters.bigButton2)}>
          {getIconComponent(
            modalDataList.find(item => item.title === selectedDisasters.bigButton2)?.iconType || 'Ionicons',
            modalDataList.find(item => item.title === selectedDisasters.bigButton2)?.icon || 'help',
            65,
            'black',
            styles.buttonIcon
          )}
          <Text style={styles.buttonText}>{selectedDisasters.bigButton2}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.bigButton, getButtonStyle(selectedDisasters.bigButton3)]} onPress={() => fetchDisasterInfo(selectedDisasters.bigButton3)}>
          {getIconComponent(
            modalDataList.find(item => item.title === selectedDisasters.bigButton3)?.iconType || 'Ionicons',
            modalDataList.find(item => item.title === selectedDisasters.bigButton3)?.icon || 'help',
            65,
            'black',
            styles.buttonIcon
          )}
          <Text style={styles.buttonText}>{selectedDisasters.bigButton3}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bigButton, getButtonStyle(selectedDisasters.bigButton4)]} onPress={() => fetchDisasterInfo(selectedDisasters.bigButton4)}>
          {getIconComponent(
            modalDataList.find(item => item.title === selectedDisasters.bigButton4)?.iconType || 'Ionicons',
            modalDataList.find(item => item.title === selectedDisasters.bigButton4)?.icon || 'help',
            65,
            'black',
            styles.buttonIcon
          )}
          <Text style={styles.buttonText}>{selectedDisasters.bigButton4}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.showAllButton} onPress={() => setShowList(!showList)}>
        <Text style={styles.showAllButtonText}>전체보기</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        style={{ flex: 1, paddingHorizontal: 15 }}
        data={showList ? allDisastersList : []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItemButton} onPress={() => fetchDisasterInfo(item.title)}>
            <Text style={styles.cellText}>{item.title}</Text>
            <MaterialIcons name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        )}
        numColumns={3}
        ListHeaderComponent={renderHeader}
      />

      <Modal visible={showModal} transparent={true} animationType="slide" onRequestClose={() => setShowModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>재난 설정</Text>
                <ScrollView contentContainerStyle={styles.iconGrid}>
                  {modalDataList.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.iconButton, getButtonStyle(item.title)]}
                      onPress={() => handleItemPress(item.title)}
                    >
                      {getIconComponent(item.iconType, item.icon)}
                      <Text style={styles.iconText}>{item.title}</Text>
                      {activeDisasters.includes(item.title) && (
                        <Text style={styles.positionIndicator}>{getSelectedItemIndex(item.title)}</Text> // 선택된 항목에 순번 표시
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
                  <Text style={styles.closeButtonText}>닫기</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {apiData && <View style={{ flex: 1, padding: 10, backgroundColor: '#f9f9f9' }}>{renderApiData()}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    padding: 10,
  },
  searchIcon: {
    marginLeft: 5,
  },
  settingsIcon: {
    marginRight: 5,
    fontSize: 14,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  settingsButtonText: {
    color: '#808080',
    fontWeight: 'bold',
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bigButton: {
    flex: 1,
    backgroundColor: '#B0E0E6',
    paddingVertical: 60,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 10,
    position: 'relative',
  },
  buttonIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 20,
  },
  showAllButton: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  showAllButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  listItemButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  cellText: {
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: '30%',  // 한 줄에 3개의 버튼이 배치되도록 설정
    height: 80,  // 버튼 높이
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',  // 버튼의 배경색을 약간 회색으로 설정
    borderWidth: 1,  // 테두리 설정
    borderColor: '#ccc',  // 테두리 색상
    borderRadius: 10,  // 테두리 둥글게 설정
  },
  iconText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  selectedItem: {
    backgroundColor: '#B0E0E6',
    borderRadius: 10,
  },
  positionIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    fontSize: 10,
    color: '#000',
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
