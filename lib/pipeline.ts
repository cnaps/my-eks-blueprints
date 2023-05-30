// lib/pipeline.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as blueprints from '@aws-quickstart/eks-blueprints';

export default class PipelineConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope,id)

    const account = props?.env?.account!;
    const region = props?.env?.region!;

    const addOn = new blueprints.ArgoCDAddOn();


    const blueprint = blueprints.EksBlueprint.builder()
    .account(account)
    .region(region)
    .addOns(addOn)
    .teams();
  
    blueprints.CodePipelineStack.builder()
      .name("eks-blueprints-workshop-pipeline")
      .owner("cnaps")
      .repository({
          repoUrl: 'my-eks-blueprints',
          credentialsSecretName: 'github-token',
          targetRevision: 'main'
      })
     // 작성하신 pipeline.ts 코드의 이 부분 뒤에 아래 코드(.wave)를 추가해주세요!
     .wave({
      id: "envs",
      stages: [   
        { id: "dev", stackBuilder: blueprint.clone('us-east-1')},
        { id: "prod", stackBuilder: blueprint.clone('ap-northeast-2')}
      ]
    })
    .build(scope, id+'-stack', { env:{ account:props?.env?.account, region:props?.env?.region}});
}
}
cdk
