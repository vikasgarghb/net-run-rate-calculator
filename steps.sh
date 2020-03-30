docker-compose up -d

npm i && npm run build

cd dist

zip -r ./createMatches.zip ./createMatchesHandler.js
zip -r ./calculateRunRate.zip ./calculateRunRateHandler.js

cd ..

awslocal lambda create-function --function-name CreateMatchesFunction --runtime nodejs12.x --handler createMatchesHandler.handler --role arn:aws:iam::012345678901:role/DummyRole --zip-file fileb://dist/createMatches.zip
awslocal lambda create-function --function-name CalculateRunRateFunction --runtime nodejs12.x --handler calculateRunRateHandler.handler --role arn:aws:iam::012345678901:role/DummyRole --zip-file fileb://dist/calculateRunRate.zip

aws stepfunctions --endpoint http://localhost:8083 create-state-machine --definition file://state-machine.json --name "NetRunRateCalculatorStateMachine" --role-arn "arn:aws:iam::012345678901:role/DummyRole"

aws stepfunctions --endpoint http://localhost:8083 start-execution --state-machine arn:aws:states:us-east-1:123456789012:stateMachine:NetRunRateCalculatorStateMachine --name test --input "{\"teamA\":\"India\", \"teamB\": \"Australia\", \"numMatches\": 3, \"matchType\": \"t20\"}"

function shutdown() {
  echo $1
  echo $2
  docker-compose down -v
  exit $3
}

while true; do
  output=$(aws stepfunctions --endpoint http://localhost:8083 describe-execution --execution-arn arn:aws:states:us-east-1:123456789012:execution:NetRunRateCalculatorStateMachine:test 2>&1)

  case $output in
  *'SUCCEEDED'*)
    shutdown "${GREEN}***EXECUTION SUCCESSFUL!***${NC}" "$output" "0"
    ;;

  *'FAILED'*)
    shutdown "${RED}***EXECUTION FAILED!***${NC}" "$output" "1"
    ;;
  esac
done
