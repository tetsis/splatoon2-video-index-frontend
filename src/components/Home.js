import React, { Component } from 'react';
import { Container, Row, Col, Form, Card, Button, Pagination, Stack, Image } from 'react-bootstrap';
import { Header } from './Header';
import { Star, StarFill, Search } from 'react-bootstrap-icons';
import toast, { Toaster } from 'react-hot-toast';
import { RuleModal } from './modals/RuleModal';
import { StageModal } from './modals/StageModal';
import { WeaponModal } from './modals/WeaponModal';
import { ChannelModal } from './modals/ChannelModal';
import toDateStringFromDateTime from '../functions/toDateStringFromDateTime';
import getServerUrl from '../functions/getServerUrl';
import 'bootstrap/dist/css/bootstrap.min.css';

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      battles: [],
      userId: localStorage.getItem("userId"),
      sessionId: localStorage.getItem("sessionId"),
      rule: "",
      ruleName: "",
      showRuleModal: false,
      stage: "",
      stageName: "",
      showStageModal: false,
      weapon: "",
      weaponName: "",
      showWeaponModal: false,
      channel: "",
      channelName: "",
      channelThumbnail: "",
      showChannelModal: false,
      minRoomPower: "",
      maxRoomPower: "",
      sort: "PublishedAt",
      page: 1,
      pageNumber: 1,
      resultNumber: 0
    };
  }

  componentDidMount() {
    this.handleUnselectRule();
    this.handleUnselectStage();
    this.handleUnselectWeapon();
    this.handleUnselectChannel();
    this.search();
  }

  search = () => {
    fetch(getServerUrl() + "/api/Battle/search" +
      "?channel=" + this.state.channel +
      "&rule=" + this.state.rule +
      "&stage=" + this.state.stage +
      "&weapon=" + this.state.weapon +
      "&minRoomPower=" + this.state.minRoomPower +
      "&maxRoomPower=" + this.state.maxRoomPower +
      "&sort=" + this.state.sort +
      "&page=" +  this.state.page, {
      headers: {
        'x-user-id': this.state.userId,
        'x-session-id': this.state.sessionId
      }
    })
      .then(res => {
        if (res.status === 200) {
          return res.json()
        }
      })
      .then(json => {
        if (json === undefined) {
          this.setState({
            battles: [],
          });
          return;
        }

        console.log(json);
        this.setState({
          battles: json.battles,
          pageNumber: json.pageNumber,
          resultNumber: json.resultNumber
        });
        if (json.pageNumber === 0) this.setState({page: 0});
      });
  }

  dateTimeFormatter(dateTime) {
    const date = new Date(dateTime);
    return (
      date.getFullYear()
      + '/' + ('0' + (date.getMonth() + 1)).slice(-2)
      + '/' + ('0' + date.getDate()).slice(-2)
    )
  }

  // ルール
  handleSelectRule = (rule) => {
    this.setState({
      rule: rule.id,
      ruleName: rule.name,
      showRuleModal: false
    }, () => {
      this.handleSearch();
    });
  }
  handleUnselectRule = () => {
    this.setState({
      rule: "all",
      ruleName: "すべて",
      showRuleModal: false
    }, () => {
      this.handleSearch();
    });
  }
  handleShowRuleModal = () => {
    this.setState({ showRuleModal: true });
  }
  handleCloseRuleModal = () => {
    this.setState({ showRuleModal: false });
  }

  // ステージ
  handleSelectStage = (stage) => {
    this.setState({
      stage: stage.id,
      stageName: stage.name,
      showStageModal: false
    }, () => {
      this.handleSearch();
    });
  }
  handleUnselectStage = () => {
    this.setState({
      stage: "all",
      stageName: "すべて",
      showStageModal: false
    }, () => {
      this.handleSearch();
    });
  }
  handleShowStageModal = () => {
    this.setState({ showStageModal: true });
  }
  handleCloseStageModal = () => {
    this.setState({ showStageModal: false });
  }

  // ブキ
  handleSelectWeapon = (weapon) => {
    this.setState({
      weapon: weapon.id,
      weaponName: weapon.name,
      showWeaponModal: false
    }, () => {
      this.handleSearch();
    });
  }
  handleUnselectWeapon = () => {
    this.setState({
      weapon: "all",
      weaponName: "すべて",
      showWeaponModal: false
    }, () => {
      this.handleSearch();
    });
  }
  handleShowWeaponModal = () => {
    this.setState({ showWeaponModal: true });
  }
  handleCloseWeaponModal = () => {
    this.setState({ showWeaponModal: false });
  }

  // チャンネル
  handleSelectChannel = (channel) => {
    this.setState({
      channel: channel.id,
      channelName: channel.channelInfo.name,
      channelThumbnail: channel.channelInfo.thumbnail,
      showChannelModal: false
    }, () => {
      this.handleSearch();
    });
  }
  handleUnselectChannel = () => {
    this.setState({
      channel: "all",
      channelName: "すべて",
      channelThumbnail: "",
      showChannelModal: false
    }, () => {
      this.handleSearch();
    });
  }
  handleShowChannelModal = () => {
    this.setState({ showChannelModal: true });
  }
  handleCloseChannelModal = () => {
    this.setState({ showChannelModal: false });
  }

  // 部屋パワー
  handleChangeMinRoomPower = (event) => {
    this.setState({ minRoomPower: event.target.value });
  }
  handleChangeMaxRoomPower = (event) => {
    this.setState({ maxRoomPower: event.target.value });
  }
  handleBlurRoomPower = () => {
    this.handleSearch();
  }

  // 並び順
  handleChangeSort = (event) => {
    this.setState(
      {
        sort: event.target.value
      }, () => {
        this.handleSearch();
      });
  }

  handleSearch = () => {
    this.setState({
      page: 1,
      pageNumber: "-",
      resultNumber: "-"
    }, () => {
      this.search();
    });
  }

  handlePrevPage = () => {
    let page = this.state.page;
    if (page > 1) {
      page = page - 1;
      this.setState({ page: page }, () => {
        this.search();
      });
    }
  }

  handleNextPage = () => {
    let page = this.state.page;
    if (page < this.state.pageNumber) {
      page = page + 1;
      this.setState({ page: page }, () => {
        this.search();
      });
    }
  }

  handleAddFavorite = (battle) => {
    let data = {
      userId: this.state.userId,
      sessionId: this.state.sessionId,
      videoId: battle.videoId,
      battleIndex: battle.battleIndex
    };
    fetch(getServerUrl() + "/api/Favorite", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.status === 200) {
          toast.success("お気に入り登録しました。")
          this.search();
        }
      });
  }

  handleRemoveFavorite = (battle) => {
    let data = {
      userId: this.state.userId,
      sessionId: this.state.sessionId,
      videoId: battle.videoId,
      battleIndex: battle.battleIndex
    };
    fetch(getServerUrl() + "/api/Favorite", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.status === 200) {
          toast.success("お気に入り解除しました。")
          this.search();
        }
      });
  }

  render() {
    return (
      <>
        <Toaster position="top-right" />

        <RuleModal
          showModal={this.state.showRuleModal}
          handleCloseModal={this.handleCloseRuleModal}
          handleSelect={this.handleSelectRule}
          handleUnselect={this.handleUnselectRule}
        />

        <StageModal
          showModal={this.state.showStageModal}
          handleCloseModal={this.handleCloseStageModal}
          handleSelect={this.handleSelectStage}
          handleUnselect={this.handleUnselectStage}
        />

        <WeaponModal
          showModal={this.state.showWeaponModal}
          handleCloseModal={this.handleCloseWeaponModal}
          handleSelect={this.handleSelectWeapon}
          handleUnselect={this.handleUnselectWeapon}
        />

        <ChannelModal
          showModal={this.state.showChannelModal}
          handleCloseModal={this.handleCloseChannelModal}
          handleSelect={this.handleSelectChannel}
          handleUnselect={this.handleUnselectChannel}
        />

        <Header />

        <Container className="mt-3 mb-3">
          <Row sm={2} md={4} className="g-4">
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        ルール
                      </div>
                      <div>
                        <Button variant="primary" type="button" onClick={this.handleShowRuleModal}>
                          <Search />
                        </Button>
                      </div>
                    </div>
                  </Card.Title>
                  <Card.Text>
                    {this.state.ruleName}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        ステージ
                      </div>
                      <div>
                        <Button variant="primary" type="button" onClick={this.handleShowStageModal}>
                          <Search />
                        </Button>
                      </div>
                    </div>
                  </Card.Title>
                  <Card.Text>
                    {this.state.stageName}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        ブキ
                      </div>
                      <div>
                        <Button variant="primary" type="button" onClick={this.handleShowWeaponModal}>
                          <Search />
                        </Button>
                      </div>
                    </div>
                  </Card.Title>
                  <Card.Text>
                    {this.state.weaponName}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        チャンネル
                      </div>
                      <div>
                        <Button variant="primary" type="button" onClick={this.handleShowChannelModal}>
                          <Search />
                        </Button>
                      </div>
                    </div>
                  </Card.Title>
                  <Card.Text>
                    <Image roundedCircle height="30px" src={this.state.channelThumbnail} />
                    {this.state.channelName}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>部屋パワー</Card.Title>
                  <Stack direction="horizontal" gap={3}>
                    <Form.Control type="text" value={this.state.minRoomPower} onChange={(e) => this.handleChangeMinRoomPower(e)} onBlur={() => this.handleBlurRoomPower()} />
                    <span> - </span>
                    <Form.Control type="text" value={this.state.maxRoomPower} onChange={(e) => this.handleChangeMaxRoomPower(e)} onBlur={() => this.handleBlurRoomPower()} />
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="auto">
              <Card>
                <Card.Body>
                  <Card.Title>並び順</Card.Title>
                  <Form.Select value={this.state.sort} onChange={(e) => this.handleChangeSort(e)}>
                    <option value="PublishedAtDesc">最近の投稿</option>
                    <option value="ViewCountDesc">再生回数</option>
                    <option value="RoomPowerDesc">部屋パワー</option>
                  </Form.Select>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        <Container className="mt-3">
          <Row sm={2} md={3} className="g-4">
            {this.state.battles.map((battle, index) => (
              <Col key={index}>
                <Card>
                  <div>
                    <iframe width="100%" src={battle.url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  </div>
                  <Card.Body>
                    <Card.Title>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          {battle.channelName}
                        </div>
                        <div>
                          {this.state.userId !== null &&
                            <>
                              {
                                battle.isFavorite === false &&
                                <Star color="gold" onClick={() => this.handleAddFavorite(battle)} />
                              }
                              {battle.isFavorite === true &&
                                <StarFill color="gold" onClick={() => this.handleRemoveFavorite(battle)} />
                              }
                            </>
                          }
                        </div>
                      </div>
                    </Card.Title>
                    <Card.Text>
                      {battle.ruleName} <br />
                      {battle.stageName} <br />
                      {battle.weaponName} <br />
                      部屋パワー：{battle.roomPower} <br />
                      投稿日：{toDateStringFromDateTime(battle.publishedAt)} <br />
                      再生回数：{battle.viewCount.toLocaleString()}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

        <Container className="mt-3">
          <Row className="justify-content-center">
            <Col sm="auto">
              <Pagination>
                <Pagination.Prev onClick={this.handlePrevPage} />
                <Pagination.Next onClick={this.handleNextPage} />
              </Pagination>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col sm="auto">
            （{this.state.page}/{this.state.pageNumber}ページ：全{this.state.resultNumber}件）
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}