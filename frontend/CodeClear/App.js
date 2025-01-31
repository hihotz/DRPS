import React, {useEffect} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Tabs from './tabs';
import VersionInfo from './tabs/Settings/pages/VersionInfo';
import LabsScreen from './tabs/Settings/pages/Labs/index';
import NewsDetail from './tabs/News/tabs/News/NewsDetail';
import ContributorList from './tabs/Settings/pages/VersionInfo/ContributorList';
import PatchNotes from './tabs/Settings/pages/VersionInfo/PatchNotes';
import VersionDetails from './tabs/Settings/pages/VersionInfo/PatchNotes/VersionDetails';
import LicenseList from './tabs/Settings/pages/VersionInfo/Opensource';
import NaturalDisasters from './tabs/SafetyGuide/pages/NaturalDisasters';
import SocialDisasters from './tabs/SafetyGuide/pages/SocialDisasters';
import LifeDisasters from './tabs/SafetyGuide/pages/LifeDisasters';
import EmergencyDisasters from './tabs/SafetyGuide/pages/EmergencyDisasters';
import CheckList from './CheckList';
import {SettingsProvider} from './Context';

const Stack = createStackNavigator();

const App = () => {
    const [isAppReady, setIsAppReady] = React.useState(false);

    useEffect(() => {
        const prepareApp = async () => {
            try {
                // 스플래시 화면 자동 숨김 방지
                await SplashScreen.preventAutoHideAsync();
                
                // 필수 체크리스트를 모두 통과했는지 확인
                const allChecksPassed = await CheckList();
                
                if (allChecksPassed) {
                    // 2초 후에 앱을 준비 상태로 전환
                    setTimeout(() => {
                        setIsAppReady(true);
                    }, 2000);
                }
            } catch (e) {
                console.warn(e); // 에러 발생 시 경고 출력
            }
        };
        prepareApp(); // 앱 준비 작업 실행
    }, []);

    // 앱 준비 완료 시 스플래시 화면 숨김 처리
    useEffect(() => {
        const hideSplashScreen = async () => {
            if (isAppReady) {
                await SplashScreen.hideAsync();
            }
        };
        hideSplashScreen(); // 스플래시 화면 숨기기
    }, [isAppReady]);

    // 앱이 준비되지 않았다면 아무것도 렌더링하지 않음
    if (!isAppReady) {
        return null;
    }

    return (
        <SettingsProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Tabs">
                    {/* 하단 탭 네비게이터 */}
                    <Stack.Screen
                        name="Tabs"
                        component={Tabs}
                        options={{headerShown: false}} // 상단 헤더 숨기기
                    />
                    {/* 실험실 화면 */}
                    <Stack.Screen
                        name="LabsScreen"
                        component={LabsScreen}
                        options={{title: 'Labs Screen'}} // 상단 타이틀 설정
                    />
                    {/* 버전 정보 화면 */}
                    <Stack.Screen
                        name="VersionInfo"
                        component={VersionInfo}
                        options={{title: 'Version Information'}}
                    />
                    {/* 기여자 목록 화면 */}
                    <Stack.Screen
                        name="ContributorList"
                        component={ContributorList}
                        options={{title: 'Contributor List'}}
                    />
                    {/* 오픈소스 라이센스 목록 화면 */}
                    <Stack.Screen
                        name="LicenseList"
                        component={LicenseList}
                        options={{title: 'License List'}}
                    />
                    {/* 패치 노트 목록 화면 */}
                    <Stack.Screen
                        name="PatchNotes"
                        component={PatchNotes}
                        options={{title: 'Patch Notes'}}
                    />
                    {/* 특정 버전 세부 정보 화면 */}
                    <Stack.Screen
                        name="VersionDetails"
                        component={VersionDetails}
                        options={{title: 'Version Details'}}
                    />
                    {/* 재난 유형 화면 (자연 재난, 사회 재난 등) */}
                    <Stack.Screen name="NaturalDisasters" component={NaturalDisasters}/>
                    <Stack.Screen name="SocialDisasters" component={SocialDisasters}/>
                    <Stack.Screen name="LifeDisasters" component={LifeDisasters}/>
                    <Stack.Screen name="EmergencyDisasters" component={EmergencyDisasters}/>
                    {/* 뉴스 상세 화면 */}
                    <Stack.Screen
                        name="NewsDetail"
                        component={NewsDetail}
                        options={{title: 'News Detail'}}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SettingsProvider>
    );
};

export default App;
