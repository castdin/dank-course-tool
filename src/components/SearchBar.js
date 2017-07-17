import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import SearchIcon from 'material-ui/svg-icons/action/search';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';
import SearchResults from './SearchResults';
import Transition from 'react-transition-group/Transition';

const courseToString = (course) => `${course.code} - ${course.title}`;

export default class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchActive: false,
            courses: [
                {
                    title: "Analysis and Design of User Interfaces",
                    code: "SEG3125",
                    sections: [
                        {
                            term: "summer",
                            year: "2017"
                        }, 
                        {
                            term: "winter",
                            year: "2018"
                        },
                        {
                            term: "winter",
                            year: "2018"
                        }
                    ]
                },
                {
                    title: "Design and Analysis of Algorithms I",
                    code: "CSI3105",
                    sections: [
                        {
                            term: "fall",
                            year: "2017"
                        }
                    ]
                }
            ]
        }
    }

    onCancelSearch = () => {
        this.setState({
            searchActive: false
        })
    }

    onSearchTextUpdate = (event, newText) => {
        const filteredCourses = this.state.courses.filter(course => courseToString(course).toLowerCase().includes(newText.toLowerCase()));
        this.setState({
            searchText: newText,
            searchActive: true,
            searchResults: filteredCourses,
            selectedCourse: undefined
        });
    }

    courseSelected = (course) => {
        this.setState({
            searchText: courseToString(course),
            selectedCourse: course
        })
    }

    render() {
        const speed = 300;
        const transitionStyles = {
            default: {
                transition: `all ${speed}ms ease-in-out`,
                position: "absolute",
                top: "50%",
                left: "15%",
                width: "70%"
            },
            entering: {
                position: "absolute",
                top: "64",
                left: "0",
                width: "100%"
            },
            entered: {
                position: "static",
                width: "100%",
                top: undefined,
                left: undefined
            }
        }
        transitionStyles.exiting = {...transitionStyles.entering}
        const styles = {
            searchBarContainer: {
                height: "56px",
                display: "flex",
                alignItems: "center",
                padding: "0 24px"
            },
            searchIcon: {
                marginRight: "20px",
                color: "rgba(0,0,0,0.3)"
            },
            backIcon: {
                marginRight: "20px",
                padding: "0",
                width: "auto",
                height: "auto"
            }
        }
        return (
            <div>
                <Transition in={this.state.searchActive} timeout={speed}>
                    {animationStatus => {
                      return (
                        <div>
                        <Paper 
                            zDepth={1}
                            style={{
                                ...styles.searchBarContainer,
                                ...transitionStyles.default,
                                ...transitionStyles[animationStatus]
                            }}
                        >
                        {
                            animationStatus == "entered" || animationStatus == "entering"
                            ? <IconButton style={styles.backIcon} tooltip="Cancel search" tooltipStyles={{top: "20px"}} onTouchTap={this.onCancelSearch}><BackIcon/></IconButton>
                            : <SearchIcon style={styles.searchIcon}/>
                        }
                            
                            <TextField
                                fullWidth={true}
                                hintText="Search for a course"
                                underlineShow={false}
                                onFocus={() => this.onSearchTextUpdate({}, this.state.searchText || "")}
                                onChange={this.onSearchTextUpdate}
                                value={this.state.searchText}
                            />
                        </Paper>
                        {
                            animationStatus == "entered"
                            ? <SearchResults key="results" courses={this.state.searchResults} onSelect={this.courseSelected} />
                            : null
                        }
                        </div>
                      )
                    }}
                    </Transition>
            </div>
        );
    }
}