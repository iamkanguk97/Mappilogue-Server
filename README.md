# 🗓️ 지도를 기반으로 현 위치 중심의 일정 및 추억을 관리할 수 있는 서비스, Mappilogue

## 프로젝트 소개

- 지도를 기반으로 현 위치 중심의 일정 및 추억을 관리할 수 있는 서비스입니다.
- 사용자는 일반 캘린더 애플리케이션 처럼 일정을 추가할 수 있으며, 일정에 대한 기록도 추가할 수 있습니다.
- 4월 중순에 배포 예정이 되어 있으며, 배포 후에는 다른 사용자들의 일정 및 기록을 확인할 수 있으며 사용자들 간의 모임 기능을 추가할 예정입니다.

<br/>

## 개발 환경

- Backend: NestJS V9 (TypeScript), TypeORM 0.3
- Database: MySQL, Redis
- Infra: AWS (EC2, RDS, S3)
- 버전관리: GitHub
- 배포 자동화: GitHub Actions + Shell Script

<br/>

## 브랜치 전략

- main, dev 브랜치를 주로 사용하였고 따로 용도에 따라 leaf branch 들을 사용했습니다.
- leaf branch는 주로 feat(기능구현), issue(클라에서 발견한 이슈해결), fix(다른 이슈 + 코드적으로 발견한 문제점), refactor(코드 리팩토링), chore(빌드 업무 및 패키지 매니저 수정)를 사용했습니다.
- dev 브랜치는 개발 단계에서 사용한 브랜치입니다. 이후 dev에서 문제가 없다고 판단되면 main과 병합하는 방식을 택했습니다.

<br/>

## 프로젝트 구조

```
📦
├─ .eslintrc.js
├─ .gitignore
├─ .prettierrc
├─ README.md
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ src
│  ├─ api
│  │  ├─ chat
│  │  │  ├─ chat.controller.spec.ts
│  │  │  ├─ chat.controller.ts
│  │  │  ├─ chat.module.ts
│  │  │  ├─ chat.service.spec.ts
│  │  │  ├─ chat.service.ts
│  │  │  ├─ dto
│  │  │  │  ├─ create-chat-room.dto.ts
│  │  │  │  ├─ create-chat.dto.ts
│  │  │  │  └─ post-chat-message.dto.ts
│  │  │  └─ entities
│  │  │     ├─ chat-room.entity.ts
│  │  │     └─ chat.entity.ts
│  │  ├─ chatgpt
│  │  │  ├─ chatgpt.module.ts
│  │  │  └─ chatgpt.service.ts
│  │  ├─ model
│  │  │  ├─ dto
│  │  │  │  └─ create-model.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ model.entity.ts
│  │  │  ├─ model.controller.spec.ts
│  │  │  ├─ model.controller.ts
│  │  │  ├─ model.module.ts
│  │  │  ├─ model.service.spec.ts
│  │  │  ├─ model.service.ts
│  │  │  └─ types
│  │  │     └─ index.ts
│  │  └─ user
│  │     ├─ dto
│  │     │  ├─ create-user.dto.ts
│  │     │  └─ update-user.dto.ts
│  │     ├─ entities
│  │     │  └─ user.entity.ts
│  │     ├─ user.controller.spec.ts
│  │     ├─ user.controller.ts
│  │     ├─ user.module.ts
│  │     ├─ user.service.spec.ts
│  │     └─ user.service.ts
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ decorators
│  │  └─ user-token.decorator.ts
│  └─ main.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
├─ tsconfig.json
└─ webpack-hmr.config.js
```

<br/>

## DB 테이블 구조

<br/>

## 역할 분담

### 이강욱

- 사용자가 설정한 옵션에 따른 커스텀 AI 모델 구축
- 채팅 관련 기능 (채팅 전송, 채팅 목록)

### 이한슬

- 사용자 관련 기능 (로그인 등)
- 홈화면 조회 기능 (사용자가 최근에 사용한 모델 리스트 등)

<br/>

## 기능 리스트

### (1) 사용자 커스텀 모델 생성

![image](https://github.com/node-cafe-iOS-presso/node/assets/121025796/1b624f4a-ce27-4f27-b8a0-ed7733b43ed0)

사용자가 원하는 사진과 모델의 옵션들을 선택할 수 있다. 참고로 위의 옵션들은 [ChatGPT Prompt Generator](https://prompt-generator.cckn.vercel.app/) 에서 참고하였다. 이렇게 사용자가 Option들을 선택해서 모델을 생성하도록 서버에 요청을 한다면 서버에서는 Option들을 조합해서 Prompt를 생성한다. 그리고 그 Prompt와 사용자가 처음으로 질문한 내용을 가지고 ChatGPT에게 API를 통해 메세지를 보낸다. 원래는 사용자가 질문하는 것을 제외하고 모델을 생성할 수 있게 하려고 했지만 API 특성상 그러지 못하였다. 그래서 모델의 생성은 사용자의 첫 질문과 모델의 첫 답변과 함께 생성된다.

![image](https://github.com/node-cafe-iOS-presso/node/assets/121025796/b27f2357-8f4c-42e1-9a83-83deb04fff1f)

그래서 Model 테이블에 ROW를 만들어주고, 사용자의 첫 질문에 대해 ChatGPT에게 답변을 받고 질의응답에 대한 채팅방과 채팅 내역 Table에 ROW를 만들어준다. ChatGPT에게 메세지를 보내는 기능은 후에 설명하도록 하겠다. 사용자 전용 모델은 위에서 생성한 Prompt를 가지고 구축된다.

![image](https://github.com/node-cafe-iOS-presso/node/assets/121025796/3ba5b709-1295-420f-9e7a-eaab81749474)

클라이언트로 부터 받은 사용자가 선택한 옵션들을 가지고 위의 사진과 같이 Prompt Format으로 만들어주는 것이다. Format도 마찬가지로 위의 Prompt Generator를 참고했다. 위의 Prompt를 가지고 ChatGPT에게 메세지를 보내면 ChatGPT는 해당 Prompt를 학습하고 나름 정확한 답변을 준다.

### (2) ChatGPT에게 채팅을 보내는 기능

![image](https://github.com/node-cafe-iOS-presso/node/assets/121025796/80aeb4ff-7c1d-4a56-af05-f0ae715981f1)

사실 이 기능은 크게 설명할 게 없긴 하다. 왜냐면 OpenAI 공식문서만 잘 본다면 충분히 작성할 수 있는 코드라고 생각하기 때문이다. 다만, 처음 모델을 구축하고 이후에 채팅을 보낼 때가 문제였다.

![image](https://github.com/node-cafe-iOS-presso/node/assets/121025796/7db11af2-ac01-4d71-9ab3-c35702cec190)

**ChatGPT를 사용해보면 알겠지만 웹에서는 이전 채팅의 내용을 기억하지만 OpenAI에서 제공하는 ChatGPT API는 이전 대화 내용을 기억하지 못한다. 그래서 DB에 저장되어 있는 채팅 내역을 가지고 메세지를 보낼 때 주입을 해주어야 한다. 하지만 공식문서에 따르면 Token (글자수) 제한이 있어서 모든 채팅 내용을 주입하지 못한다. 참고로 Token 제한이 넘으면 과금이 된다고 한다. 물론 해당 문제를 해결하기 위해 Lang-Chain 이라는 기술을 도입할 수 있는데 해커톤 행사상 구현할 시간이 부족하기 때문에 어쩔 수 없이 Token 제한을 넘기지 않는다고 가정하고 기능을 구현하였다. (Token 제한 = 약 4000자)**

![image](https://github.com/node-cafe-iOS-presso/node/assets/121025796/20ab140e-6543-4d01-a4bc-dfe4d7161843)

위의 코드는 ChatGPT에게 메세지를 보낼 때 Prompt를 생성하는 코드인데 이전의 채팅내용도 포함시켜주는 메서드이다. 우리의 프로젝트 특성상 모델이 먼저 메세지를 보내는 경우는 없기 때문에 index가 홀수인 것은 사용자의 채팅이고, 짝수인 것은 모델의 답장이라고 판단했다.

ChatGPT에게 이전의 대화내용을 적용시켜 주려고 할 때 위와 같이 role을 user와 assistant로 구분을 지어주어야 하고, 실제 채팅내역의 순서를 지켜주어야 한다. 그리고 마지막에는 사용자가 보내려고 하는 메세지를 넣어준다. 그리고 아까 모델 생성할 때의 코드와 동일하게 ChatGPT에게 메세지를 보내고 답장을 받아온다.

<br/>

## 해커톤 후기

아래에 올려놓은 블로그 링크를 참고해주세요!

<br/>

## 기타 링크

- [[회고] 제 2회 가천대학교 와글와글 해커톤 참여 후기](https://dev-iamkanguk.tistory.com/entry/%ED%9A%8C%EA%B3%A0-%EC%A0%9C-2%ED%9A%8C-%EA%B0%80%EC%B2%9C%EB%8C%80%ED%95%99%EA%B5%90-%EC%99%80%EA%B8%80%EC%99%80%EA%B8%80-%ED%95%B4%EC%BB%A4%ED%86%A4-%EC%B0%B8%EC%97%AC-%ED%9B%84%EA%B8%B0)
- [발표자료 및 시연영상](https://drive.google.com/drive/folders/11OPHXpnf3bhppbVZPwdAUmnXfIMlbi3y)
