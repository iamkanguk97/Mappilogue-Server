# 🗓️ 지도를 기반으로 현 위치 중심의 일정 및 추억을 관리할 수 있는 서비스, Mappilogue

<p align="center">
  <img src="https://github.com/iamkanguk97/Mappilogue-Server/assets/121025796/ca5da9e1-0dd7-4120-b3cd-b95dddd780af" />
</p>

## 프로젝트 소개

- 지도를 기반으로 현 위치 중심의 일정 및 추억을 관리할 수 있는 서비스입니다.
- 사용자는 일반 캘린더 애플리케이션 처럼 일정을 추가할 수 있으며, 일정에 대한 기록도 추가할 수 있습니다.
- 4월 중순에 배포 예정이 되어 있으며, 배포 후에는 다른 사용자들의 일정 및 기록을 확인할 수 있으며 사용자들 간의 모임 기능을 추가할 예정입니다.

<br/>

## 개발 환경

- NestJS (TypeScript)
- MySQL, TypeORM
- AWS (EC2, RDS, S3), Nginx
- Redis Caching
- 배포 자동화: GitHub Actions + Shell Script

<br/>

## 아키텍처
!사진 넣기!

<br/>

## 브랜치 전략

- main, dev 브랜치를 주로 사용하였고 따로 용도에 따라 leaf branch 들을 사용했습니다.
- leaf branch는 주로 feat(기능구현), issue(클라에서 발견한 이슈해결), fix(다른 이슈 + 코드적으로 발견한 문제점), refactor(코드 리팩토링), chore(빌드 업무 및 패키지 매니저 수정)를 사용했습니다.
- dev 브랜치는 개발 단계에서 사용한 브랜치입니다. 이후 dev에서 문제가 없다고 판단되면 main과 병합하는 방식을 택했습니다.

<br/>

## 디렉토리 설명
- `.github`: GitHub Actions의 workflow 파일 저장
- `@types`: 타입 정의 디렉토리 (맵필로그에서는 solarlunar 라이브러리를 통해 음력날짜를 제공합니다)
- `scripts`: 배포 자동화 스크립트 디렉토리

아래는 src 디렉토리의 하위 디렉토리에 대한 설명입니다.
- `common`: 공통적으로 사용할 수 있는 함수, DTO 또는 예외 코드들이 저장되어 있습니다.
- `decorators`: 전체적으로 사용할 수 있는 데코레이터를 저장하는 디렉토리입니다.
- `filters`: 예외 필터 저장 디렉토리입니다.
- `helpers`: 유틸 함수들이 저장되어 있습니다. helper 디렉토리에서는 메서드만 다룹니다.
- `interceptors`: 요청 또는 응답을 가로채어 전처리 과정을 할 수 있는 인터셉터 디렉토리입니다.
- `middlewares`: 미들웨어 디렉토리입니다. 맵필로그에서는 Logger를 위해 미들웨어를 적용했습니다.
- `modules`: 프로젝트의 중심이 되는 디렉토리입니다. 크게 api 디렉토리와 core 디렉토리로 나누어집니다.
  - `api`: 도메인을 기준으로 나누었으며 각 도메인 별로 Layer를 나누어서 프로젝트를 구축하였습니다.
  - `core`: 프로젝트의 코어가 되는 부분을 저장했습니다. (Notification, Auth 등)
- `types`: 특정 도메인에 속한 타입이 아닌 프로젝트 전체적으로 사용하는 타입을 저장하는 디렉토리입니다.

<br/>

## DB 테이블 구조
![mappilogue-erd-image](https://github.com/iamkanguk97/Mappilogue-Server/assets/121025796/ddde0963-5f55-4126-bfcf-83e673308f13)

조금 더 좋은 UI로 저희 맵필로그 DB 테이블을 보고 싶으시다면 아래 링크를 통해 확인해주세요!
> URL : https://aquerytool.com/aquerymain/index/?rurl=9193d966-1e03-4584-a87f-cb7dd75e0fdd& <br/>
> Password : j47wy4

<br/>

## Commit Convention
커밋 컨벤션은 많이들 사용하시는 컨벤션 그대로 사용했습니다. 대신에 저는 Check 라는 브랜치를 추가로 사용했습니다.

- `feat` : 새로운 기능 추가
- `fix` : 버그 수정
- `docs` : 문서 내용 변경
- `style` : 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우 등
- `refactor` : 코드 리팩토링
- `test` : 테스트 코드 작성
- `chore` : 빌드 수정, 패키지 매니저 설정, 운영 코드 변경이 없는 경우 등
- `check` : 일반 작업물 커밋 또는 전체적인 코드 점검하는 경우 등

<br/>

## Code Convention
개인 프로젝트라서 엄격하게 컨벤션을 지키지는 못했습니다. 하지만 최근 클린코드를 공부하기 시작했고 맵필로그 프로젝트를 개발하며 최대한 지켜보려고 노력했습니다. 그래서 다음과 같은 사항들은 기본적으로 지키면서 코드를 작성할 수 있도록 노력했습니다.

### (1) Controller, Service, Repository Method 이름 + Interface/Type/Enum 변수 이름 규칙
**1️⃣ Controller**
- 맵필로그에서는 HTTP의 GET/POST/DELETE/PUT/PATCH 메서드를 사용합니다.
- 각 API에서 요구하는 HTTP Method를 Prefix로 해서 메서드 이름을 작성했습니다.
- ex) 회원 조회 -> getUser / 회원 생성 -> postUser / 회원 삭제 -> deleteUser / ...

**2️⃣ Service**
- Service 메서드에서는 Controller와 연결된 메서드인지 아닌지로 나누었습니다.
- Controller와 연결된 메서드인 경우에는 다음과 같은 규칙을 정하여 메서드 이름의 prefix를 설정했습니다.
  - GET: find
  - POST: create
  - DELETE: remove
  - PUT과 PATCH: modify
- 이 외 연결되지 않은 메서드는 다음과 같은 규칙을 정했습니다. 하지만 이는 다른 추가 케이스들이 있으면 추가 또는 수정이 될 수도 있을 것 같습니다.
  - 특정 도메인의 값(상태)를 확인하는 경우: check
  - DTO 또는 특정 변수의 구조 또는 값을 변경하려는 경우: set

**3️⃣ Repository**
- Repository 쪽에서는 주로 Select할 때 복잡한 쿼리를 작성해야 하는 경우에만 메서드를 생성했습니다.
- DB 명령어를 Prefix로 사용했습니다. (SELECT / UPDATE / INSERT / ...)

**4️⃣ Interface, Type, Enum**
해당 방법은 커뮤니티에도 의견을 많이 물어봤는데 개발자 분들마다 취향이 전부 다른 것 같은데 사내에서는 잘 사용되지 않는 규칙이라고 많이 들은 것 같아서 개인 프로젝트이기 때문에 크리티컬한 이슈는 아니어서 기회가 된다면 시간을 투자하여 수정해보려고 합니다.
- Interface: I<Interface이름>
- Type: T<Type이름>
- Enum: E<Enum이름>

### (2) 메서드 또는 변수의 명을 명확하게 지어서 불필요한 주석은 없애자
- 개발자의 의도에 따라 메소드 또는 변수의 이름을 명확하게 지어서 주석 없이도 바로 알아볼 수 있게 작성하도록 노력했습니다.
- 그로 인해서 각 Layer에 필요한 Method인 경우와 특별한 경우가 아닌 이상 불필요한 주석은 최대한 작성하지 않도록 했습니다.

### (3) 함수는 최대한 1가지의 기능을 하도록, 그리고 인수(매개변수)는 최대 2개를 넘지 말자
- 각각의 함수는 1가지의 기능에 충실하는 것이 좋다는 글을 봤습니다. 맵필로그에 최대한 적용하려고 노력은 했지만 아직 부족한 점이 많다고 생각되어 추후에도 지속적으로 검토해가며 수정을 할 예정입니다.
- 클린코드에서는 "최선은 인수의 개수가 없는 것이다" 라는 문장이 있습니다. 하지만 부득이하게 함수에서 인수가 필요로 할 때가 많았습니다. 완벽하게 지키지는 못했지만 인수의 개수를 최대한 줄일 수 있으면 줄여보자 라는 마인드로 코드를 작성했습니다.

<br/>

## 구현된 기능 및 2차 개발 예정 기능
맵필로그 1차 개발에서는 크게 다음 기능들을 제공합니다.

- 소셜 로그인 (카카오 및 애플 로그인)
- JWT를 활용한 인증 (Refresh Token 도입 및 RTR, Access Token BlackList With Redis)
- 회원탈퇴 시 회원 관련 데이터 트래픽을 고려하여 매일 새벽 5시에 탈퇴 유저 확인하여 삭제 처리 (CronJob)
- 캘린더 조회 및 캘린더에 생성할 수 있는 일정 관련 CRUD
- 각 일정에 할당할 수 있는 알림 서비스 (FCM)
- 유저가 생성한 일정과 연결하여 추억(기록) CRUD
- 본인 위치 주변의 기록 리스트 조회 with Pagination (Offset 기반 페이지네이션)
  - Cursor 기반의 페이지네이션을 사용하지 않은 이유는 아래 블로그 링크로!
- 기록에 지정할 수 있는 카테고리 CRUD

추가로, 배포 이후 바로 개발 예정들인 기능들이 있습니다.
- 다른 유저들의 일정과 기록을 조회할 수 있도록 함
- 유저들 간의 모임을 기획할 수 있는 서비스
- 개선된 캘린더 기능 (1차에서는 iOS와 Android의 캘린더 화면이 다름)

🐥 자세한 기능들을 보고 싶으시면 [해당 API 문서](https://iamkanguk.notion.site/MAPPILOGUE-API-V2-SHEET-89190866930f41b787c76bd9d70e0caa?pvs=4)를 확인해주세요! 🐥

<br/>

## 프로젝트를 하면서 어려웠거나 고민을 많이 한 부분을 정리한 블로그!
- [[맵필로그] GitHub Action + Shell Script를 활용한 자동 배포 + 트러블슈팅](https://dev-iamkanguk.tistory.com/entry/%EB%A7%B5%ED%95%84%EB%A1%9C%EA%B7%B8-Shell-Script%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-%EC%9E%90%EB%8F%99-%EB%B0%B0%ED%8F%AC-PM2)
- [[맵필로그] 로그아웃 + 회원탈퇴 기능 구현 기록](https://dev-iamkanguk.tistory.com/entry/%EB%A7%B5%ED%95%84%EB%A1%9C%EA%B7%B8-%EB%A1%9C%EA%B7%B8%EC%95%84%EC%9B%83-%ED%9A%8C%EC%9B%90%ED%83%88%ED%87%B4-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84-%EA%B8%B0%EB%A1%9D)
- [[맵필로그] 아주 많이 고생한 애플로그인 구현 기록..! (Passport X)](https://dev-iamkanguk.tistory.com/entry/%EB%A7%B5%ED%95%84%EB%A1%9C%EA%B7%B8-%EC%95%84%EC%A3%BC-%EB%A7%8E%EC%9D%B4-%EA%B3%A0%EC%83%9D%ED%95%9C-%EC%95%A0%ED%94%8C%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EA%B5%AC%ED%98%84-%EA%B8%B0%EB%A1%9D-Passport-X)
- [[맵필로그] Strict Mode 설정 + 발생한 이슈 + tsconfig.json 일부 분석](https://dev-iamkanguk.tistory.com/entry/%EB%A7%B5%ED%95%84%EB%A1%9C%EA%B7%B8-Strict-Mode-%EC%84%A4%EC%A0%95-%EB%B0%9C%EC%83%9D%ED%95%9C-%EC%9D%B4%EC%8A%88-tsconfigjson-%EC%9D%BC%EB%B6%80-%EB%B6%84%EC%84%9D)
- [[맵필로그 + NestJS] Access-Token과 Refresh-Token 전략 정리와 수정해야 할 부분 in NestJS? (약간 장문주의)](https://dev-iamkanguk.tistory.com/entry/%EB%A7%B5%ED%95%84%EB%A1%9C%EA%B7%B8-Access-Token%EA%B3%BC-Refresh-Token-%EC%A0%84%EB%9E%B5-%EC%A0%95%EB%A6%AC%EC%99%80-%EC%88%98%EC%A0%95%ED%95%B4%EC%95%BC-%ED%95%A0-%EB%B6%80%EB%B6%84)
- [[맵필로그] 캘린더 화면 로직 좌충우돌 기록!](https://dev-iamkanguk.tistory.com/entry/%EB%A7%B5%ED%95%84%EB%A1%9C%EA%B7%B8-%EC%BA%98%EB%A6%B0%EB%8D%94-%ED%99%94%EB%A9%B4-%EB%A1%9C%EC%A7%81-%EC%A2%8C%EC%B6%A9%EC%9A%B0%EB%8F%8C-%EA%B8%B0%EB%A1%9D)
